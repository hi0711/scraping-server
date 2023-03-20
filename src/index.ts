import puppeteer from 'puppeteer';
import fs from 'fs';
import moment from 'moment';

// スクレイピングするための関数
const scrape = async (query: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // URL 定義
  await page.goto(`https://www.google.com/search?q=${query}`);
  // 日時取得
  const date: string = moment().format('YYYYMMDDHHmmss');

  // タイトルと URL を取得
  const result = await page.$$eval('.tF2Cxc', (elements) => {
    return elements.map((element) => {
      return {
        title: element.querySelector('.DKV0Md')?.textContent,
        url: element.querySelector('.yuRUbf a')?.getAttribute('href'),
      };
    });
  });

  // 5分ごとに日時をファイル名に入れて保存
  setInterval(() => {
    fs.writeFile(`result-${date}.json`, JSON.stringify(result), (err) => {
      if (err) {
        console.log(err);
      }
    });
  }, 300000);

  await browser.close();
}

// 関数を実行
scrape('aaa');
