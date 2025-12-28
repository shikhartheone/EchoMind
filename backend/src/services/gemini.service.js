const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
let genAI = null;
let model = null;

function heuristicSummary(transcripts) {
  const lines = (transcripts || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const summary = lines.slice(0, 5).join(" ");
  const decisions = lines
    .filter((l) =>
      /\b(decide|decision|we will|let's|agree|finalize)\b/i.test(l)
    )
    .slice(0, 10);
  const open_questions = lines
    .filter((l) => /\?$/.test(l) || /\b(question|ask|clarify)\b/i.test(l))
    .slice(0, 10);
  return { summary, decisions, open_questions };
}

function init() {
  if (!API_KEY) {
    // No key: skip Gemini init; we'll use heuristic
    return;
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });
  }
}

async function summarizeMeeting(transcripts) {
  init();
  if (!API_KEY || !model) {
    console.log("📊 Using HEURISTIC summary (no API key or model)");
    return heuristicSummary(transcripts);
  }

  const prompt = `You are EchoMind, an AI meeting assistant. Given the meeting transcript, produce a JSON object with keys: summary, decisions, open_questions.\n\nTranscript:\n${transcripts}\n\nReturn strictly JSON.`;

  try {
    console.log("🤖 Calling GEMINI for summary...");
    const resp = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    let text =
      resp?.response?.text?.() ||
      resp?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "{}";

    // Strip markdown code block wrapper if present
    text = text
      .replace(/^```json\n?/, "")
      .replace(/\n?```$/, "")
      .trim();

    const parsed = JSON.parse(text);
    console.log("✅ GEMINI summary generated successfully");
    return {
      summary: parsed.summary || "",
      decisions: parsed.decisions || [],
      open_questions: parsed.open_questions || [],
    };
  } catch (e) {
    console.log("⚠️ GEMINI failed, falling back to HEURISTIC:", e.message);
    return heuristicSummary(transcripts);
  }
}

module.exports = { summarizeMeeting };
