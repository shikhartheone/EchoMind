import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

export default function MeetingStatus() {
  const [connected, setConnected] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);

  useEffect(() => {
    const check = () => {
      const room = window.room;
      setConnected(!!room && room.state === "connected");
      if (room?.localParticipant) {
        setMicEnabled(room.localParticipant.isMicrophoneEnabled ?? false);
      }
    };

    check();
    const timer = setInterval(check, 500);
    return () => clearInterval(timer);
  }, []);

  const toggleMic = async () => {
    try {
      const room = window.room;
      if (!room?.localParticipant) {
        console.error("❌ No room or localParticipant");
        return;
      }
      await room.localParticipant.setMicrophoneEnabled(!micEnabled);
      setMicEnabled(!micEnabled);
    } catch (err) {
      console.error("❌ Mic toggle error:", err);
    }
  };

  return (
    <Card
      sx={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        background: "rgba(255,255,255,0.98)",
        borderRadius: 2,
        mb: 3,
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: connected ? "#4caf50" : "#9e9e9e",
                animation: connected ? "pulse 2s infinite" : "none",
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {connected ? "🎤 Connected" : "⚪ Not Connected"}
            </Typography>
          </Box>
          <Button
            onClick={toggleMic}
            variant="contained"
            size="small"
            sx={{
              background: micEnabled ? "#4caf50" : "#f44336",
              color: "white",
              fontWeight: 600,
              px: 2,
              py: 0.7,
              borderRadius: 1,
              "&:hover": { opacity: 0.9 },
              transition: "all 0.2s",
            }}
          >
            {micEnabled ? "🎙️ ON" : "🔇 OFF"}
          </Button>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {connected
            ? "Microphone " + (micEnabled ? "is ON" : "is OFF")
            : "Join a meeting to control microphone"}
        </Typography>
      </CardContent>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Card>
  );
}
