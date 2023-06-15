// For more information, see https://crawlee.dev/
import { CheerioCrawler, ProxyConfiguration, log, Dataset } from "crawlee";
import { router } from "./routes.js";

// const startUrls = ['https://crawlee.dev'];

// const startUrls = ['https://autoplius.lt/skelbimai/naudoti-automobiliai?make_date_from=&make_date_to=2022&sell_price_from=&sell_price_to=&engine_capacity_from=&engine_capacity_to=&power_from=&power_to=&kilometrage_from=&kilometrage_to=&qt=&qt_autocomplete=&has_damaged_id=10924&category_id=2&make_id_list=44&make_id%5B44%5D=253_279&slist=2032916153&page_nr=1'];
const startUrls = [
  "https://autoplius.lt/skelbimai/naudoti-automobiliai?make_date_from=&make_date_to=2022&&has_damaged_id=10924&category_id=2&make_id_list=44&make_id%5B44%5D=253_279&slist=2032916153&page_nr=1",
];

const crawler = new CheerioCrawler({
  maxRequestsPerCrawl: 20,
  // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
  // requestHandler: router,

  async requestHandler({ $, request, enqueueLinks }) {
    // log.info(`Processing ${request.url}...`);
    const title = $("title").text();
    const announcements = $(".announcement-body");
    const carDataPromises: Promise<void>[] = [];
    announcements.each((_i, announcement) => {
      announcement;
      const priceText = $(announcement)
        .find(".announcement-pricing-info")
        .text()
        .trim();
      const dateOfProduction = $(announcement)
        .find("div.announcement-title-parameters > div > span:nth-child(1)")
        .text()
        .trim();

        const carModel = $(announcement)
        .find("div.announcement-title-container > div.announcement-title")
        .text()
        .trim();
        // #autoplius > div.container > div.small-wrapper > div.content-wrapper > div.content > div.cntnt-box-fixed > div.col-2 > div.auto-lists.lt > a:nth-child(13) > div > div.announcement-body > div.announcement-body-heading > div.announcement-title-container > div.announcement-title
        // #autoplius > div.container > div.small-wrapper > div.content-wrapper > div.content > div.cntnt-box-fixed > div.col-2 > div.auto-lists.lt > a:nth-child(13) > div > div.announcement-body > div.announcement-body-heading > div.announcement-title-container > div.announcement-title-parameters > div > span:nth-child(1)
        // .('.announcement-pricing-info').text().trim();
      log.info(JSON.stringify({ priceText, dateOfProduction }));

      const results = {
        url: request.url,
        priceText,
        dateOfProduction,
        carModel,
        dateCreated: new Date(),
      };

      carDataPromises.push(Dataset.pushData(results));
    });
    await Promise.all(carDataPromises);

    console.log(`The title of "${request.url}" is: ${title}.`);

    await enqueueLinks({
      selector: ".page-navigation-container .next",
      // selector: '.ActorStorePagination-pages > a',
      label: "Next",
    });
  },
});

await crawler.run(startUrls);
