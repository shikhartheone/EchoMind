const WebSocket = require("ws");

exports.startAudioServer = () => {
  const wss = new WebSocket.Server({ port: 9001 });

  wss.on("connection", (ws) => {
    console.log("🎧 Audio stream connected");

    ws.on("message", (chunk) => {
      if (Date.now() % 5000 < 50) {
        console.log("🎧 Receiving audio...");
      }

      // Next: send to Whisper
    });
  });
};
