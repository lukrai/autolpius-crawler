// For more information, see https://crawlee.dev/
import { CheerioCrawler, ProxyConfiguration, log, Dataset } from "crawlee";
import { router } from "./routes.js";
import { matchCarModel, convertPriceTextToNumber } from "./carModels.js";

// const startUrls = ['https://crawlee.dev'];

// const startUrls = ['https://autoplius.lt/skelbimai/naudoti-automobiliai?make_date_from=&make_date_to=2022&sell_price_from=&sell_price_to=&engine_capacity_from=&engine_capacity_to=&power_from=&power_to=&kilometrage_from=&kilometrage_to=&qt=&qt_autocomplete=&has_damaged_id=10924&category_id=2&make_id_list=44&make_id%5B44%5D=253_279&slist=2032916153&page_nr=1'];
const startUrls = [
  "https://autoplius.lt/skelbimai/naudoti-automobiliai?make_date_from=&make_date_to=2022&has_damaged_id=10924&category_id=2&make_id_list=44&make_id%5B44%5D=253_279&slist=2032916153&page_nr=1", // Toyota Corrola/Auris
  "https://autoplius.lt/skelbimai/naudoti-automobiliai?make_date_from=&make_date_to=2022&has_damaged_id=10924&category_id=2&make_id_list=43&make_id%5B43%5D=193&slist=2056726079&page_nr=1", // VW Golf
  "https://autoplius.lt/skelbimai/naudoti-automobiliai?make_date_from=&make_date_to=2022&has_damaged_id=10924&category_id=2&make_id_list=43&make_id%5B43%5D=193&slist=2056726079&page_nr=1", // Mercedes-Benz C
  "https://autoplius.lt/skelbimai/naudoti-automobiliai?make_date_from=&make_date_to=2022&has_damaged_id=10924&category_id=2&make_id_list=99&make_id%5B43%5D=1340&slist=2056726079&page_nr=1", // Audi A4
  "https://autoplius.lt/skelbimai/naudoti-automobiliai?make_date_from=&make_date_to=2022&has_damaged_id=10924&category_id=2&make_id_list=97&make_id%5B43%5D=1319&slist=2056726079&page_nr=1", // BMW 3
  "https://autoplius.lt/skelbimai/naudoti-automobiliai?make_date_from=&make_date_to=2022&has_damaged_id=10924&category_id=2&make_id_list=44&make_id%5B43%5D=221&slist=2056726079&page_nr=1" // Toyota Rav4
];

const crawler = new CheerioCrawler({
  maxRequestsPerMinute: 300,
  // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
  // requestHandler: router,

  async requestHandler({ $, request, enqueueLinks }) {
    const title = $("title").text();
    const announcements = $(".announcement-body");
    const parsedCarData: {
      url: string;
      priceText: number;
      dateOfProduction: string;
      carModel: string;
      dateCreated: Date;
    }[] = [];
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
      const carId = $(announcement)
        .find(".announcement-comment-hidden")
        .attr("data-id");
      // #autoplius > div.container > div.small-wrapper > div.content-wrapper > div.content > div.cntnt-box-fixed > div.col-2 > div.auto-lists.lt > a:nth-child(13) > div > div.announcement-body > div.announcement-body-heading > div.announcement-title-container > div.announcement-title
      // #autoplius > div.container > div.small-wrapper > div.content-wrapper > div.content > div.cntnt-box-fixed > div.col-2 > div.auto-lists.lt > a:nth-child(13) > div > div.announcement-body > div.announcement-body-heading > div.announcement-title-container > div.announcement-title-parameters > div > span:nth-child(1)
      // .('.announcement-pricing-info').text().trim();
      log.info(JSON.stringify({ priceText, dateOfProduction, carModel, carId }));

      if (carModel) {
        const results = {
          url: request.url,
          priceText: convertPriceTextToNumber(priceText),
          carId,
          dateOfProduction,
          carModel: matchCarModel(carModel),
          dateCreated: new Date(),
        };

        parsedCarData.push(results);
      }
    });
    await Dataset.pushData({ results: parsedCarData });

    console.log(`The title of "${request.url}" is: ${title}.`);

    await enqueueLinks({
      selector: ".page-navigation-container .next",
      // selector: '.ActorStorePagination-pages > a',
      label: "Next",
    });
  },
});

await crawler.run(startUrls);
