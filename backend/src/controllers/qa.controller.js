const { askMeeting } = require("../services/qa.service");

async function handleAskMeeting(req, res) {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required" });
    }

    console.log("📝 Q&A request:", question);
    const answer = await askMeeting(question);

    return res.json({ question, answer });
  } catch (err) {
    console.error("/ask error:", err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
}

module.exports = { handleAskMeeting };
