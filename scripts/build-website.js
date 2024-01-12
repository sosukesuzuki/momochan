import * as fs from "node:fs/promises";
import * as prettier from "prettier";
import * as dist from "./dist.js";

const data = JSON.parse(await fs.readFile(dist.DIST_JSON_URL));

let html = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <title>桃ちゃん弁当 非公式メニュー</title>
      <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <h1>桃ちゃん弁当 非公式メニュー（更新日: ${data.updated}）</h1>
      <p>このウェブサイトは非公式です。公式の最新情報は <a href="https://momo-chan.jp/">桃ちゃん弁当のウェブサイト</a> や電話で確認してください。</p>
      <table>
        <tr>
          <th>商品名</th>
          <th>種類</th>
          <th>価格</th>
        </tr>`;

data.products.forEach((product) => {
  html += `
        <tr>
          <td>${product.name}</td>
          <td>${product.type}</td>
          <td>${product.price}円</td>
        </tr>`;
});

html += `
      </table>
    </body>
    </html>`;

await fs.writeFile(
  dist.DIRT_HTML_URL,
  await prettier.format(html, { parser: "html" })
);
