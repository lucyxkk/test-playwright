const { chromium } = require("playwright");
const songURL =
  "https://www.tekstowo.pl/piosenka,kizo,disney__prod__sergiusz__lesny_.html";

const login = "-";
const password = "-";

start();

async function start() {
  console.log("Getting the song lyrics...");

  const page = await openBrowser();
  const songLyrics = await downloadLyrics(page);
  await sendMessages(page, songLyrics);

  console.log("Done");
}

async function openBrowser() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  return page;
}

async function downloadLyrics(page) {
  await page.goto(songURL);
  await page
    .frameLocator("#cmp-iframe")
    .getByRole("button", { name: "Accept All" });

  //   .click();
  // await page.getByRole("button", { name: "Tak, mam ukończone 18 lat" }).click();

  let song = await page.locator("#songText .inner-text").innerText();
  console.log(song);
  let splitSong = song.split(/\r?\n/);
  console.log(splitSong);
  const regex = new RegExp(/\[\w*\]/g);
  function filterArray(text){
    return !text.match(regex);
}
  let result = splitSong.filter(filterArray);
  return result;
}

async function sendMessages(page, result) {
  await page.goto("https://www.facebook.com/");
  await page
    .getByRole("button", { name: "Zezwól na wszystkie pliki cookie" })
    .click();
  await page.getByTestId("royal_email").click();
  await page.getByTestId("royal_email").click();
  await page.getByTestId("royal_email").fill(login);
  await page.getByTestId("royal_pass").click();
  await page.getByTestId("royal_pass").fill(password);
  await page.getByTestId("royal_login_button").click();
  await page.getByRole("button", { name: "Messenger" }).click();
  await page.getByPlaceholder("Szukaj w Messengerze").click();
  await page.getByPlaceholder("Szukaj w Messengerze").fill("mic");
  await page.getByRole("link", { name: "Michał Kisiel", exact: true }).click();

  for (let i = 0; i <= result.length; i++) {
    await page.getByRole("textbox", { name: "Wiadomość" }).fill(result[i]);
    await page.getByRole("textbox", { name: "Wiadomość" }).press("Enter");
    await sleep(1500);
  }
}

function sleep(time) {
  return new Promise(function (myResolve) {
    setTimeout(myResolve, time);
  });
}
