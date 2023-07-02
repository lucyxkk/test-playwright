const {chromium} = require('playwright');
const songURL = "https://www.tekstowo.pl/piosenka,kizo,disney__prod__sergiusz__lesny_.html";
console.log('Getting the song lyrics...');
start();
async function start() {
  const browser = await chromium.launch();

  const context = await browser.newContext();
  
  const page = await context.newPage();
  
  await page.goto(
      songURL
    );
    await page
      .frameLocator("#cmp-iframe")
      .getByRole("button", {name: "Accept All"})
    
    //   .click();
    // await page.getByRole("button", { name: "Tak, mam ukończone 18 lat" }).click();
  
  
    let song = await page.locator("#songText .inner-text").innerText();
    console.log(song);  
}
