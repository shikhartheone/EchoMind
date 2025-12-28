import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const RAG_URL = "http://127.0.0.1:5000";

export default function AiPanel() {
  const [recent, setRecent] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // Poll recent transcripts
  useEffect(() => {
    let timer;
    const fetchRecent = async () => {
      try {
        let res = await fetch(`${RAG_URL}/recent?n=20`);
        if (!res.ok && res.status === 404) {
          // fallback alias
          res = await fetch(`${RAG_URL}/recents?n=20`);
        }
        if (!res.ok) return; // silent if service down
        const data = await res.json();
        setRecent(data.items || []);
      } catch (e) {
        // silent failure; will retry next tick
      }
    };
    fetchRecent();
    timer = setInterval(fetchRecent, 2000);
    return () => clearInterval(timer);
  }, []);

  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch(`${RAG_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question, n_results: 5 }),
      });
      const data = await res.json();
      const docs = data.documents || [];
      setAnswer(docs[0] || "No matching context found.");
    } catch (e) {
      setAnswer("Query failed.");
    } finally {
      setLoading(false);
    }
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
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          🎤 Live Transcripts
        </Typography>
        <Box
          sx={{
            background: "#f5f5f5",
            borderRadius: 1,
            p: 1.5,
            maxHeight: 300,
            overflowY: "auto",
            mb: 2,
          }}
        >
          <List dense sx={{ py: 0 }}>
            {recent.length > 0 ? (
              recent.map((r, idx) => (
                <ListItem
                  key={r.id || idx}
                  sx={{
                    py: 0.5,
                    px: 0,
                    "&:hover": {
                      background: "rgba(102, 126, 234, 0.05)",
                      borderRadius: 0.5,
                    },
                  }}
                >
                  <ListItemText
                    primary={`[${r.speaker}] ${r.text}`}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: "0.9rem",
                        fontFamily: "Consolas, monospace",
                      },
                    }}
                  />
                </ListItem>
              ))
            ) : (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "center", py: 2 }}
              >
                Waiting for transcripts...
              </Typography>
            )}
          </List>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
          💬 Ask EchoMind
        </Typography>
        <Box display="flex" gap={1} mb={2}>
          <TextField
            fullWidth
            placeholder="Did anyone mention budget?"
            size="small"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && ask()}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
          />
          <Button
            variant="contained"
            onClick={ask}
            disabled={loading}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              fontWeight: 600,
              px: 2,
              borderRadius: 1,
              whiteSpace: "nowrap",
            }}
          >
            {loading ? "..." : "Ask"}
          </Button>
        </Box>
        {answer && (
          <Box
            sx={{
              background: "#e3f2fd",
              border: "1px solid #90caf9",
              borderRadius: 1,
              p: 1.5,
              mt: 2,
            }}
          >
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              <strong>✨ Answer:</strong> {answer}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
