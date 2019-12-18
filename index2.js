// const request = require("request");
const request = require("request-promise-native");
const cheerio = require("cheerio");

const getUrl = (pageNo = 1) =>
  `https://autoplius.lt/skelbimai/naudoti-automobiliai?page_nr=${pageNo}`;

async function executeRequest() {
  let next;
  let pageNo = 1;
  try {
    const responseBody = await request(getUrl());
    const $ = cheerio.load(responseBody);

    const links = [];
    const announcementItems = $(".announcement-item");
    announcementItems.each((i, o) => {
      const hrefLink = $(o).attr("href");
      links.push(hrefLink);
    });
    collectDescriptions(links);

    next = $("a.next");
    pageNo++;
  } catch (error) {
    console.log(error);
    errorHandler(error);
  }

  while (next != null) {
    try {
      const responseBody = await request(getUrl(pageNo));
      const $ = cheerio.load(responseBody);

      const links = [];
      const announcementItems = $(".announcement-item");
      announcementItems.each((i, o) => {
        const hrefLink = $(o).attr("href");
        links.push(hrefLink);
      });
      collectDescriptions(links);

      next = $("a.next");
      pageNo++;
    } catch (error) {
      errorHandler(error);
      // console.log(error);
    }
  }
}

async function collectDescriptions(links) {
  for (const [index, link] of links.entries()) {
    try {
      const responseBody = await request(getUrl(link));
      const $ = cheerio.load(responseBody);
      const announcementDescription = $(".announcement-description").text();
      if (
        announcementDescription &&
        announcementDescription.search(/kaip naujas|pirktas/i) > -1
      ) {
        console.log(
          "------------------------------------------------------------------------------------------------------------------"
        );
        console.log(link);
        console.log(announcementDescription);
      }
    } catch (error) {
      errorHandler(error);
      // console.log(error);
    }
  }
}

function errorHandler(error) {
  if (error.error) {
    const $ = cheerio.load(error.error);
    const img = $("img").attr(
      "src",
      "https://autoplius.lt/utility/captcha/text"
    );
    console.log(img[0]);
  }
}

(async () => {
  executeRequest();
})();
