const WebSocket = require("ws");
const { addTranscript } = require("../memory/meetingMemory");
const { addToShortTerm } = require("../memory/shortTerm");

class DeepgramStream {
  constructor(speaker = "unknown") {
    this.ws = null;
    this.isOpen = false;
    this.speaker = speaker;
  }

  connect(sampleRate = 48000) {
    const url =
      `wss://api.deepgram.com/v1/listen` +
      `?model=nova-2` +
      `&encoding=linear16` +
      `&sample_rate=${sampleRate}` +
      `&channels=1` +
      `&punctuate=true` +
      `&smart_format=true` +
      `&interim_results=true`;

    this.ws = new WebSocket(url, {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
      },
    });

    this.ws.on("open", () => {
      console.log("🧠 Deepgram connected");
      this.isOpen = true;
    });

    this.ws.on("message", (msg) => {
      const data = JSON.parse(msg.toString());

      const transcript = data?.channel?.alternatives?.[0]?.transcript || "";
      const isFinal = data?.is_final || false;

      if (transcript.trim()) {
        console.log("📝", transcript);

        // Save to memory if final transcript
        if (isFinal) {
          addToShortTerm(transcript, this.speaker);
          addTranscript(transcript, this.speaker);
        }
      }
    });

    this.ws.on("close", () => {
      console.log("❌ Deepgram disconnected");
      this.isOpen = false;
    });

    this.ws.on("error", (e) => {
      console.error("Deepgram error:", e);
    });
  }

  sendAudio(pcm16Buffer) {
    if (!this.isOpen) return;
    this.ws.send(pcm16Buffer);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

module.exports = { DeepgramStream };
