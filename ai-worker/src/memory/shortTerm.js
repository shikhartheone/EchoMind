const MAX_TURNS = 25;
const buffer = [];

function addToShortTerm(text, speaker) {
  buffer.push({ text, speaker, time: Date.now() });
  if (buffer.length > MAX_TURNS) buffer.shift();
  console.log(
    "🧠 STM:",
    buffer.map((b) => b.text)
  );
}

function getShortTerm() {
  return buffer.map((x) => `[${x.speaker}] ${x.text}`).join("\n");
}

module.exports = { addToShortTerm, getShortTerm };
