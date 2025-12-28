const { askGemini } = require("./gemini.service");

async function askMeeting(question) {
  // Query RAG service for relevant meeting context
  const ragUrl = process.env.RAG_URL || "http://127.0.0.1:5000";

  try {
    console.log("🔍 Querying RAG for context...", question);
    const resp = await fetch(`${ragUrl}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: question, n_results: 5 }),
    });

    if (!resp.ok) {
      return "Unable to search meeting context.";
    }

    const data = await resp.json();
    const chunks = data.documents || [];

    if (chunks.length === 0) {
      return "Not discussed in this meeting.";
    }

    // Build context from chunks
    const context = chunks.map((c, i) => `(${i + 1}) ${c}`).join("\n");

    // Create prompt for Gemini
    const prompt = `You are EchoMind, a meeting assistant.
Answer the user's question ONLY based on the meeting context provided.
Be concise and specific.

Meeting Context:
${context}

User Question:
${question}

If the information is not found in the context, respond with: "Not discussed in this meeting."`;

    // Get answer from Gemini
    const answer = await askGemini(prompt);
    return answer;
  } catch (e) {
    console.error("Q&A error:", e);
    return "Error processing your question. Please try again.";
  }
}

module.exports = { askMeeting };
