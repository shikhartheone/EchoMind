import JoinCard from "../components/meeting/JoinCard";
import MeetingStatus from "../components/meeting/MeetingStatus";
import ParticipantsList from "../components/meeting/ParticipantsList";
import AiPanel from "../components/ai/AiPanel";
import { Grid, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [inMeeting, setInMeeting] = useState(false);

  useEffect(() => {
    const check = () => {
      const room = window.room;
      setInMeeting(!!room && room.state === "connected");
    };

    check();
    const timer = setInterval(check, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        {!inMeeting ? (
          <JoinCard />
        ) : (
          <Box
            sx={{
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              background: "rgba(255,255,255,0.98)",
              borderRadius: 2,
              p: 3,
              mb: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#4caf50", mb: 1 }}
            >
              ✅ Meeting Connected
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You are currently in the EchoMind meeting
            </Typography>
          </Box>
        )}
        <MeetingStatus />
        <AiPanel />
      </Grid>
      <Grid item xs={12} md={4}>
        <ParticipantsList />
      </Grid>
    </Grid>
  );
}
