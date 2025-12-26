const livekitService = require("../services/livekit.service");

exports.getToken = async (req, res) => {
  const { room, name } = req.body;

  if (!room || !name) {
    return res.status(400).json({ error: "room and name are required" });
  }

  try {
    const jwt = await livekitService.createToken(room, name);
    res.json({ token: jwt });
  } catch (err) {
    console.error("Token generation failed", err);
    res.status(500).json({ error: "Failed to generate token" });
  }
};
