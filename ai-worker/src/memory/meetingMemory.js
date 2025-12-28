const RAG_SERVICE_URL = "http://127.0.0.1:5000";

// Simple in-memory queue for robust posting
const _queue = [];
let _draining = false;

async function _postAdd(text, speaker) {
  const res = await fetch(`${RAG_SERVICE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, speaker }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `status ${res.status}`);
  }
  console.log("✅ RAG add ok:", `[${speaker}]`, text.slice(0, 60));
}

async function _drainQueue() {
  if (_draining) return;
  _draining = true;
  try {
    while (_queue.length) {
      const item = _queue[0];
      try {
        await _postAdd(item.text, item.speaker);
        _queue.shift();
        console.log(
          "📤 RAG delivered queued:",
          `[${item.speaker}]`,
          item.text.slice(0, 60)
        );
      } catch (e) {
        // Stop on first failure, will retry later
        break;
      }
    }
  } finally {
    _draining = false;
  }
}

// Periodically retry queued posts
setInterval(_drainQueue, 2000);

async function addTranscript(text, speaker) {
  // Try immediate post; if it fails, enqueue for retry
  try {
    await _postAdd(text, speaker);
  } catch (err) {
    console.warn("⚠️ RAG add failed, queued for retry:", err.message);
    _queue.push({ text, speaker });
  }
}

async function queryMemory(q) {
  try {
    const res = await fetch(`${RAG_SERVICE_URL}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q, n_results: 5 }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }
    const data = await res.json();
    return data.documents || [];
  } catch (err) {
    console.warn("⚠️ RAG query failed:", err.message);
    return [];
  }
}

module.exports = { addTranscript, queryMemory };
