const { startBot } = require("./browser/bot");
const { startAudioServer } = require("./audio/ws-server");

module.exports = async () => {
  startAudioServer();
  await startBot();
};
