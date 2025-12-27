const puppeteer = require("puppeteer");

const FRONTEND_URL = "http://localhost:3000";

async function startBot() {
  const browser = await puppeteer.launch({
    headless: false, // keep visible for debugging
    args: [
      "--use-fake-ui-for-media-stream",
      "--autoplay-policy=no-user-gesture-required",
    ],
  });

  const page = await browser.newPage();

  await page.goto(FRONTEND_URL);

  // Wait for name input
  await page.waitForSelector("input");

  // Type bot name
  await page.type("input", "EchoMind-AI");

  // Click Join button
  await page.click("button");

  console.log("🤖 EchoMind AI joined meeting");
}

module.exports = { startBot };
