const { createClient } = require("@deepgram/sdk");

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

async function sendToGemini(pcm, sampleRate) {
  try {
    const audioBuffer = Buffer.from(pcm);
    const rate = sampleRate || 48000;

    const url = `https://api.deepgram.com/v1/listen?model=nova-2&encoding=linear16&sample_rate=${rate}&channels=1&language=en&smart_format=true&punctuate=true`;
    const started = Date.now();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        // Explicit raw PCM content-type for Deepgram
        "Content-Type": `audio/l16; rate=${rate}; channels=1`,
      },
      body: audioBuffer,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Deepgram HTTP ${response.status}: ${text}`);
    }

    const result = await response.json();
    const elapsed = Date.now() - started;
    const transcript =
      result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";

    if (transcript) {
      console.log("📝", transcript, `(in ${elapsed}ms)`);
    } else {
      console.log(`ℹ️ No transcript returned (elapsed ${elapsed}ms)`);
      const summary = {
        keys: Object.keys(result || {}),
        resultsKeys: Object.keys(result?.results || {}),
        channels: result?.results?.channels?.length,
        alternatives:
          result?.results?.channels?.[0]?.alternatives?.length ?? "n/a",
      };
      //   console.log("Deepgram summary:", summary);
      //   console.log(
      //     "Deepgram raw (truncated):",
      //     JSON.stringify(result).slice(0, 800) + "..."
      //   );
    }
  } catch (error) {
    console.error("Error transcribing with Deepgram:", error.message || error);
  }
}

module.exports = { sendToGemini };
