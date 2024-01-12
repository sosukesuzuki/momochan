import fs from "node:fs/promises";

import * as playwright from "playwright";

const DIST_JSON_URL = new URL("../dist/momochan.json", import.meta.url);

const MOMOCHAN_BASE_URL = "https://momo-chan.jp";
const MOMOCHAN_MENU_PATH_LIST = ["menu", "menu/page/2", "menu/page/3"];

const browser = await playwright.chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

const output = {
  $schema:
    "https://raw.githubusercontent.com/sosukesuzuki/momochan/main/schema/schema.json",
  updated: new Date().toISOString().split("T")[0],
  products: [],
};

for (const MOMOCHAN_MENU_PATH of MOMOCHAN_MENU_PATH_LIST) {
  await page.goto(new URL(MOMOCHAN_MENU_PATH, MOMOCHAN_BASE_URL).toString());
  const products = await page.$$eval(".menu_list", (menuLists) =>
    menuLists
      .map((menuList) => {
        const category = menuList.querySelector(".menu_category").innerText;
        return Array.from(menuList.querySelectorAll(".menu")).map((menu) => {
          const name = menu.querySelector(".menu_title a").innerText;
          const price = Number.parseInt(
            menu.querySelector(".menu_price").innerText.replace(/\D/g, ""),
            10
          );
          return { name, type: category, price };
        });
      })
      .flat()
  );
  output.products.push(...products);
}

await browser.close();

await fs.writeFile(DIST_JSON_URL, JSON.stringify(output, null, 2) + "\n");
