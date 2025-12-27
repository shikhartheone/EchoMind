const puppeteer = require("puppeteer");

const FRONTEND_URL = "http://localhost:3000";

async function startBot() {
  const browser = await puppeteer.launch({
    headless: false, // keep visible for now
    args: [
      "--use-fake-ui-for-media-stream",
      "--autoplay-policy=no-user-gesture-required",
    ],
  });

  const page = await browser.newPage();
  await page.goto(FRONTEND_URL);

  // Join meeting
  await page.waitForSelector("input");
  await page.type("input", "EchoMind-AI");
  await page.click("button");

  console.log("🤖 EchoMind AI joined meeting");

  // 🔊 Capture LiveKit audio from <audio> elements
  await page.evaluate(() => {
    const ws = new WebSocket("ws://localhost:9001");

    const audioCtx = new AudioContext();
    const mixer = audioCtx.createGain(); // acts as mixer
    mixer.connect(audioCtx.destination); // optional: hear audio

    const processor = audioCtx.createScriptProcessor(4096, 1, 1);
    mixer.connect(processor);
    processor.connect(audioCtx.destination);

    processor.onaudioprocess = (e) => {
      const data = e.inputBuffer.getChannelData(0);
      ws.send(data);
    };

    // Observe LiveKit audio elements
    const observer = new MutationObserver(() => {
      document.querySelectorAll("audio").forEach((audio) => {
        if (!audio._connected) {
          const source = audioCtx.createMediaElementSource(audio);
          source.connect(mixer);
          audio._connected = true;
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

module.exports = { startBot };
