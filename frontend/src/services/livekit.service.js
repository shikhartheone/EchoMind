import { Room, createLocalAudioTrack } from "livekit-client";
import { getToken } from "../api/livekit.api";

const LIVEKIT_URL = process.env.REACT_APP_LIVEKIT_URL;

export async function joinMeeting(
  roomName = "echomind-demo",
  name,
  role = "human" // "human" | "ai"
) {
  if (!name) {
    throw new Error("Name is required to join meeting");
  }

  console.log("Joining as", role);
  const { data } = await getToken(roomName, name);

  const room = new Room({
    adaptiveStream: true,
    dynacast: true,
    autoSubscribe: true,
  });

  await room.connect(LIVEKIT_URL, data.token);
  window.room = room;

  // 🎤 Only humans publish microphone audio
  if (role === "human") {
    const micTrack = await createLocalAudioTrack();
    await room.localParticipant.publishTrack(micTrack);
  }

  // 🔊 Attach remote audio tracks (both human & AI listen)
  room.on("trackSubscribed", (track) => {
    if (track.kind !== "audio") return;

    const el = track.attach();

    if (role === "ai") {
      el.muted = true;
      el.style.display = "none";
      document.body.appendChild(el);
    }
  });

  return room;
}
