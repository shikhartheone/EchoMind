const {
  Room,
  RoomEvent,
  TrackKind,
  AudioStream,
} = require("@livekit/rtc-node");
const { AccessToken } = require("livekit-server-sdk");
const WebSocket = require("ws");
const { DeepgramStream } = require("./stt/deepgram.ws");

const LIVEKIT_URL = process.env.LIVEKIT_URL;
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;

async function startAgent(roomName) {
  // Generate access token for the AI agent
  const token = new AccessToken(API_KEY, API_SECRET, {
    identity: "echomind-ai",
    name: "EchoMind AI Assistant",
  });
  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  const jwt = await token.toJwt();

  // Connect to the room
  const room = new Room();

  await room.connect(LIVEKIT_URL, jwt);

  console.log("🤖 EchoMind AI joined room", roomName);

  room.on(
    RoomEvent.TrackSubscribed,

    async (track, publication, participant) => {
      if (track.kind !== TrackKind.KIND_AUDIO) return;

      console.log("🎧 Audio track from", participant.identity);

      // Create audio stream to receive frames
      const audioStream = new AudioStream(track);

      // Open Deepgram streaming socket once per subscribed audio track
      const dg = new DeepgramStream();
      dg.connect(48000);

      for await (const frame of audioStream) {
        const buf = Buffer.from(
          frame.data.buffer,
          frame.data.byteOffset,
          frame.data.byteLength
        );
        dg.sendAudio(buf);
      }

      dg.close();
    }
  );

  room.on(RoomEvent.Disconnected, () => {
    console.log("❌ Disconnected from room");
  });
}

module.exports = { startAgent };
