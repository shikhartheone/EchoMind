import { Room, createLocalAudioTrack } from "livekit-client";
import { getToken } from "../api/livekit.api";

const LIVEKIT_URL = process.env.REACT_APP_LIVEKIT_URL;

export async function joinMeeting(roomName = "echomind-demo", name) {
  if (!name) throw new Error("Name is required to join meeting");

  const { data } = await getToken(roomName, name);

  const room = new Room({
    adaptiveStream: true,
    dynacast: true,
  });

  await room.connect(LIVEKIT_URL, data.token);

  const micTrack = await createLocalAudioTrack();
  await room.localParticipant.publishTrack(micTrack);

  room.on("trackSubscribed", (track) => {
    if (track.kind === "audio") {
      track.attach();
    }
  });

  return room;
}
