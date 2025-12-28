const { summarizeMeeting } = require("../services/gemini.service");

async function generateMeetingSummary(req, res) {
  try {
    const n = Number(req.query.n || 100);

    // Pull recent transcripts from Python RAG service
    const ragUrl = process.env.RAG_URL || "http://127.0.0.1:5000";
    const r = await fetch(`${ragUrl}/recent?n=${n}`);
    if (!r.ok) {
      return res
        .status(502)
        .json({ error: "RAG recent fetch failed", status: r.status });
    }
    const data = await r.json();
    const items = Array.isArray(data.items) ? data.items : [];
    if (items.length === 0) {
      return res.json({
        summary: "No transcripts yet.",
        decisions: [],
        open_questions: [],
      });
    }

    const transcripts = items.map((i) => `[${i.speaker}] ${i.text}`).join("\n");

    const summary = await summarizeMeeting(transcripts);
    return res.json(summary);
  } catch (err) {
    console.error("/summary error:", err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
}

module.exports = { generateMeetingSummary };
