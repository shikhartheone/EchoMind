import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";

function getParticipantsFromRoom(room) {
  if (!room) return [];
  const arr = [];
  // include local
  const lp = room.localParticipant;
  if (lp) {
    arr.push({ id: lp.sid || "local", name: lp.name || lp.identity || "You" });
  }
  // include remotes - participants is a Map, not an array
  if (room.participants && typeof room.participants === "object") {
    room.participants.forEach?.((p) => {
      arr.push({ id: p.sid, name: p.name || p.identity || "Unknown" });
    });
  }
  return arr;
}

export default function ParticipantsList() {
  const [participants, setParticipants] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const room = window.room;
      if (!room) {
        setConnected(false);
        setParticipants([]);
        return;
      }
      setConnected(true);
      setParticipants(getParticipantsFromRoom(room));
    };

    refresh();
    const timer = setInterval(refresh, 800);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card
      sx={{
        position: "sticky",
        top: 72,
        zIndex: 100,
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        background: "rgba(255,255,255,0.98)",
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            👥 Participants
          </Typography>
          <Box
            sx={{
              background: connected ? "#4caf50" : "#f44336",
              color: "white",
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              minWidth: 40,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {participants.length}
            </Typography>
          </Box>
        </Box>
        <List sx={{ pt: 0 }}>
          {participants.length > 0 ? (
            participants.map((p, idx) => (
              <ListItem
                key={idx}
                sx={{
                  py: 0.8,
                  px: 0,
                  "&:hover": { background: "#f5f5f5", borderRadius: 1 },
                  transition: "all 0.2s",
                }}
              >
                <ListItemText
                  primary={p.name}
                  primaryTypographyProps={{
                    sx: { fontWeight: 500, fontSize: "0.95rem" },
                  }}
                />
              </ListItem>
            ))
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 2 }}
            >
              No participants
            </Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
}
