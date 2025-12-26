require("dotenv").config();

// console.log("KEY:", process.env.LIVEKIT_API_KEY);
// console.log("SECRET:", process.env.LIVEKIT_API_SECRET ? "LOADED" : "MISSING");

const express = require("express");
const cors = require("cors");
const { AccessToken } = require("livekit-server-sdk");

const app = express();
app.use(cors());
app.use(express.json());

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
  console.error("❌ LiveKit keys missing in .env");
  process.exit(1);
}

app.post("/getToken", async (req, res) => {
  const { room, name } = req.body;

  if (!room || !name) {
    return res.status(400).json({ error: "room and name are required" });
  }

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: name }
  );

  token.addGrant({
    roomJoin: true,
    room: room,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  const jwt = await token.toJwt(); // 👈 THIS IS THE FIX

  //   console.log("Generated JWT:", jwt.slice(0, 30) + "...");

  res.json({ token: jwt });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 EchoMind backend running on port ${PORT}`);
});
