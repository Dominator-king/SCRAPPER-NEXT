let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}
async function Scrapper(search) {
  let options = {};
  let browser;
  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
    browser = await chrome.puppeteer.launch(options);
  }
  browser = puppeteer.launch();
  async function daraz_scrapper() {
    let pages = await browser.pages();
    let page = pages[0];
    await page.goto("https://www.daraz.pk/", { timeout: 0 });
    await page.type("#q", search + " \n");
    try {
      await page.waitForNavigation();
      await page.waitForSelector(".gridItem--Yd0sa");
      const allProducts = await page.evaluate(() => {
        const prods = document.querySelectorAll(".gridItem--Yd0sa");

        return Array.from(prods).map((prod) => {
          const link = prod.querySelector("a").href;
          const title = prod.querySelector(".title--wFj93").textContent;
          const price = prod.querySelector(".price--NVB62").textContent;
          const img = prod.querySelector("#id-img").src;
          return { title, price, link, img };
        });
      });
      allProducts.sort(
        (a, b) =>
          Number(
            a.price.substring(a.price.indexOf(" "), a.price.indexOf(",")) +
              a.price.substring(a.price.indexOf(",") + 1)
          ) -
          Number(
            b.price.substring(b.price.indexOf(" "), b.price.indexOf(",")) +
              b.price.substring(b.price.indexOf(",") + 1)
          )
      );

      page.close();
      return allProducts.slice(0, 3);
    } catch {
      page.close();
      return "No products";
    }
  }

  async function ideas_scrapper() {
    let page = await browser.newPage();
    await page.goto("https://www.gulahmedshop.com/", { timeout: 0 });
    await page.waitForSelector("#search ");
    await page.click("#search ");
    await page.waitForSelector("#search");
    await page.type("#search", search + " \n");
    try {
      await page.waitForNavigation();
      await page.waitForSelector("#category-products-grid > ol > li");
      const allProducts = await page.evaluate(() => {
        const cards = document.querySelectorAll(
          "#category-products-grid > ol > li"
        );
        return Array.from(cards).map((card) => {
          const price = card.querySelector(".price").textContent;
          const title = card.querySelector(
            "#category-products-grid > ol > li > div > div.product.details.product-item-details > a > strong > span"
          ).textContent;
          const link = card.querySelector("a").href;
          const img = card.querySelector("a").firstChild.src;

          return { title, price, link, img };
        });
      });
      allProducts.sort(
        (a, b) =>
          Number(
            a.price.substring(a.price.indexOf(" "), a.price.indexOf(",")) +
              a.price.substring(a.price.indexOf(",") + 1)
          ) -
          Number(
            b.price.substring(b.price.indexOf(" "), b.price.indexOf(",")) +
              b.price.substring(b.price.indexOf(",") + 1)
          )
      );
      page.close();
      return allProducts.slice(0, 3);
    } catch {
      page.close();
      return "No products";
    }
  }

  async function chaseValue_scrapper() {
    let page = await browser.newPage();
    await page.goto("https://chasevalue.pk/", { timeout: 0 });

    await page.waitForSelector("#pageheader > div > div > form > input");
    await page.type("#pageheader > div > div > form > input", search + " \n");
    try {
      await page.waitForSelector("div.grid-uniform > li");
      const allProducts = await page.evaluate(() => {
        const prods = document.querySelectorAll("div.grid-uniform > li");
        console.log(prods);

        return Array.from(prods).map((prod) => {
          const link = prod.querySelector("div > div.product-detail > a").href;
          const title = prod.querySelector(
            "div > div.product-detail > a"
          ).textContent;
          const price = prod.querySelector(
            " div > div.product-detail > div.grid-link__meta > div > div > span"
          ).textContent;
          const img = prod.querySelector("img.featured-image").src;

          return { title, price, link, img };
        });
      });

      allProducts.sort(
        (a, b) =>
          Number(
            a.price.substring(a.price.indexOf(" "), a.price.indexOf(",")) +
              a.price.substring(a.price.indexOf(",") + 1)
          ) -
          Number(
            b.price.substring(b.price.indexOf(" "), b.price.indexOf(",")) +
              b.price.substring(b.price.indexOf(",") + 1)
          )
      );
      page.close();
      return allProducts.slice(0, 3);
    } catch {
      page.close();
      return "No products";
    }
  }
  async function affordable_scrapper() {
    let page = await browser.newPage();
    await page.goto("https://www.affordable.pk/", {
      timeout: 0,
      waitUntil: "load",
    });
    await page.waitForSelector(
      "body > header > div > div > div.h-list.flex-space-between > ul > li.search-icon > a"
    );
    await page.click(
      "body > header > div > div > div.h-list.flex-space-between > ul > li.search-icon > a"
    );
    await page.type("#searching", search + " \n");
    try {
      await page.waitForSelector(
        "#closet_filter > div > div.row.subcat-upper > div.col-xs-10.product-main-outter.active > div.row.products-holder.flex-wrapper.gap-bottom-20 > div:nth-child(1) > div.pro-item"
      );
      const allProducts = await page.evaluate(() => {
        const prods = document.querySelectorAll(
          "#closet_filter > div > div.row.subcat-upper > div.col-xs-10.product-main-outter.active > div.row.products-holder.flex-wrapper.gap-bottom-20 > div > div.pro-item"
        );
        return Array.from(prods).map((prod) => {
          const link = prod.querySelector(
            "#closet_filter > div > div.row.subcat-upper > div.col-xs-10.product-main-outter.active > div.row.products-holder.flex-wrapper.gap-bottom-20 > div > div > figure > a"
          ).href;
          const title = prod.querySelector(
            "#closet_filter > div > div.row.subcat-upper > div.col-xs-10.product-main-outter.active > div.row.products-holder.flex-wrapper.gap-bottom-20 > div > div > div > p > a"
          ).textContent;
          const price = prod.querySelector(
            "#closet_filter > div > div.row.subcat-upper > div.col-xs-10.product-main-outter.active > div.row.products-holder.flex-wrapper.gap-bottom-20 > div > div > div > ul > li.price > span:nth-child(1)"
          ).textContent;
          const img = prod.querySelector(
            "#closet_filter > div > div.row.subcat-upper > div.col-xs-10.product-main-outter.active > div.row.products-holder.flex-wrapper.gap-bottom-20 > div > div > figure > a > img"
          ).src;
          return { title, price, link, img };
        });
      });
      allProducts.sort(
        (a, b) =>
          Number(
            a.price.substring(a.price.indexOf(" "), a.price.indexOf(",")) +
              a.price.substring(a.price.indexOf(",") + 1)
          ) -
          Number(
            b.price.substring(b.price.indexOf(" "), b.price.indexOf(",")) +
              b.price.substring(b.price.indexOf(",") + 1)
          )
      );

      page.close();
      return allProducts.slice(0, 3);
    } catch {
      page.close();
      return "No products";
    }
  }
  let compData = [];
  const [a, b, c, d] = await Promise.allSettled([
    daraz_scrapper(),
    ideas_scrapper(),
    chaseValue_scrapper(),
    affordable_scrapper(),
  ]);
  const arr = compData.concat(a.value, b.value, c.value, d.value);

  browser.close();

  return arr;
}
export async function GET() {
  const res = await Scrapper("search");
  return new Response(JSON.stringify(res));
}
