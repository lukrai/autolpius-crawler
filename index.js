const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 900 });
  await page.goto("https://autoplius.lt/skelbimai/naudoti-automobiliai");

  let next = await page.$("a.next");
  while (next != null) {
    await collectDescriptions(page);
    next = await page.$("a.next");
    if (next != null) {
      await next.focus();
      await next.click();
      await page.waitForNavigation({ waitUntil: "networkidle0" });
      const checkUrl = await page.evaluate(() => location.href);
      console.log(
        "-----------------------------------------------------------------------------"
      );
      console.log("Next Page:", checkUrl);
      console.log(
        "-----------------------------------------------------------------------------"
      );
    }
  }

  setTimeout(async () => {
    console.log("timeout");
    await browser.close();
  }, 640000);
})();

async function collectDescriptions(page) {
  const annoucements = await page.$$(".announcement-item");
  const links = [];
  for (const [index, annoucement] of annoucements.entries()) {
    const href = await annoucement.getProperty("href");
    const hrefLink = await href.jsonValue();
    links.push(hrefLink);
  }
  for (const [index, link] of links.entries()) {
    await page.goto(link);
    const checkUrl = await page.evaluate(() => location.href);
    console.log(checkUrl);
    const description = await page.$(".announcement-description");
    if (description != null) {
      const text = await (
        await description.getProperty("textContent")
      ).jsonValue();
      if (text && text.search(/kaip naujas|pirktas/i) > -1) {
        console.log(text);
      }
    }
    await page.goBack();
  }
}
