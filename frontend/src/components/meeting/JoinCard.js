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
    <Card
      sx={{
        width: "100%",
        mb: 3,
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        background: "rgba(255,255,255,0.98)",
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          🎧 Join Meeting
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: "0.95rem", mb: 3 }}>
          AI-powered real-time meeting assistant
        </Typography>

        <TextField
          fullWidth
          label="Your Name"
          placeholder="Enter your name"
          variant="outlined"
          sx={{ mt: 2, mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleJoin()}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            fontWeight: 600,
            py: 1.2,
            fontSize: "1rem",
            borderRadius: 1,
            transition: "all 0.3s",
            "&:hover": {
              boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
              transform: "translateY(-2px)",
            },
            "&:disabled": { opacity: 0.6 },
          }}
          disabled={loading}
          onClick={handleJoin}
        >
          {loading ? "Joining..." : "JOIN MEETING"}
        </Button>
      </CardContent>
    </Card>
  );
}
