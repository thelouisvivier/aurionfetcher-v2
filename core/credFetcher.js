const puppeteer = require('puppeteer');
const config = require('../config/config.json')

module.exports = async function(trail){
  console.log("Starting credentials fetcher...");

  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'fr'
  });
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1
  });

  await page.goto('https://'+config.domain+'/faces/Login.xhtml');
  await page.type('#username', config.username);
  await page.type('#password', config.password);
  await page.keyboard.press('Enter');
  await page.waitForNavigation();

  const myScheduleBtn = await page.$x("//*[contains(text(), 'Mon Planning')]");
  if (myScheduleBtn.length > 0) {
    await myScheduleBtn[0].click();
  } else {
    throw new Error("My Schedule button not found");
  }

  await page.waitForSelector('.fc-month-button');

  const [viewStateHandle] = await page.$x("//input[@name='javax.faces.ViewState']");
  const viewStatePropertyHandle = await viewStateHandle.getProperty('value');
  const viewStatePropertyValue = await viewStatePropertyHandle.jsonValue();
  trail.viewState = viewStatePropertyValue;

  const [formIdHandle] = await page.$$(".schedule");
  const formIdPropertyHandle = await formIdHandle.getProperty('id');
  const formIdPropertyValue = await formIdPropertyHandle.jsonValue();
  trail.formId = formIdPropertyValue;

  const cookies = await page.cookies();
  const sessionIdValue = cookies[0]["value"];
  trail.sessionId = sessionIdValue;

  await browser.close();
  console.log("Credentials fetched !");
  return true;
};
