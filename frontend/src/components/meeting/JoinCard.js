import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { joinMeeting } from "../../services/livekit.service";

export default function JoinCard() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!name.trim()) return alert("Please enter your name");
    setLoading(true);
    await joinMeeting("echomind-demo", name);
    setLoading(false);
  };

  return (
    <Card sx={{ maxWidth: 400, margin: "auto", mt: 10 }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h5">Join EchoMind Meeting</Typography>
        <Typography color="text.secondary" mt={1}>
          AI-powered real-time assistant
        </Typography>

        <TextField
          fullWidth
          label="Your Name"
          variant="outlined"
          sx={{ mt: 3 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
          onClick={handleJoin}
        >
          {loading ? "Joining..." : "Join Meeting"}
        </Button>
      </CardContent>
    </Card>
  );
}
