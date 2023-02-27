const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");

const app = express();
const cors = require("cors");
const port = 3000;

app.use(cors());

// puppeteer
async function run() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();
  await page.goto(
    "https://themeforest.net/popular_item/by_category?category=wordpress"
  );

  let data = await page.evaluate(() => {
    let itemGridDivs = document.querySelectorAll(
      ".shared-items_grid_with_sidebar_component__itemsGrid .shared-item_cards-card_component__root"
    );
    let scrapData = [];
    itemGridDivs.forEach((e) => {
      let title = e.querySelector(
        ".shared-item_cards-grid-image_card_component__content h3"
      ).innerText;
      let userName = e.querySelector(
        ".shared-item_cards-grid-image_card_component__content .shared-item_cards-author_category_component__root a"
      ).innerText;

      let links = e.querySelector(
        ".shared-item_cards-grid-image_card_component__content .shared-item_cards-author_category_component__root a"
      ).href;
      scrapData.push({ title, userName, links });
    });
    return scrapData;
  });

  console.log(data);

  let writer = fs.createWriteStream("test.txt");

  writer.write(JSON.stringify(data));

  await browser.close();
}

run();

// server
app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
