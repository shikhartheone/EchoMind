const { AccessToken } = require("livekit-server-sdk");
const config = require("../config/livekit");

exports.createToken = (room, name) => {
  const token = new AccessToken(config.apiKey, config.apiSecret, {
    identity: name,
  });

  token.addGrant({
    roomJoin: true,
    room,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return token.toJwt();
};
