import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:5050";
const RAG_URL = "http://127.0.0.1:5000";

export default function MeetingSummary() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const generate = async () => {
    setLoading(true);
    try {
      console.log("🧠 Summary: Calling backend...");
      const res = await fetch(`${BACKEND_URL}/api/summary?n=100`);
      if (res.ok) {
        const json = await res.json();
        console.log("✅ Summary: Got response from backend", json);
        setData(json);
        return;
      }
      console.log(
        "⚠️ Summary: Backend not OK (" +
          res.status +
          "), using client heuristic"
      );
      // Fallback to client-side heuristic using RAG recents
      const r = await fetch(`${RAG_URL}/recent?n=100`);
      const data = r.ok ? await r.json() : { items: [] };
      const items = Array.isArray(data.items) ? data.items : [];
      const lines = items
        .map((i) => `[${i.speaker}] ${i.text}`)
        .filter(Boolean);
      const summary = lines.slice(0, 5).join(" ");
      const decisions = lines
        .filter((l) =>
          /\b(decide|decision|we will|let's|agree|finalize)\b/i.test(l)
        )
        .slice(0, 10);
      const open_questions = lines
        .filter((l) => /\?$/.test(l) || /\b(question|ask|clarify)\b/i.test(l))
        .slice(0, 10);
      console.log("📋 Summary: Client-side heuristic generated");
      setData({
        summary: summary || "No transcripts yet.",
        decisions,
        open_questions,
      });
    } catch (e) {
      console.log("❌ Summary: Error", e.message);
      // Network or parse error: soft fallback text
      setData({
        summary: "No transcripts yet.",
        decisions: [],
        open_questions: [],
      });
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            🧠 Meeting Summary
          </Typography>
          <Button
            variant="contained"
            onClick={generate}
            disabled={loading}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              fontWeight: 600,
            }}
          >
            {loading ? "Generating…" : "Generate"}
          </Button>
        </Box>

        {data ? (
          <>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Summary
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {data.summary || ""}
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Decisions
            </Typography>
            <List dense>
              {(data.decisions || []).map((d, i) => (
                <ListItem key={i} sx={{ py: 0.5 }}>
                  <ListItemText primary={d} />
                </ListItem>
              ))}
              {(!data.decisions || data.decisions.length === 0) && (
                <Typography variant="caption" color="text.secondary">
                  No decisions captured.
                </Typography>
              )}
            </List>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Open Questions
            </Typography>
            <List dense>
              {(data.open_questions || []).map((q, i) => (
                <ListItem key={i} sx={{ py: 0.5 }}>
                  <ListItemText primary={q} />
                </ListItem>
              ))}
              {(!data.open_questions || data.open_questions.length === 0) && (
                <Typography variant="caption" color="text.secondary">
                  No open questions.
                </Typography>
              )}
            </List>
          </>
        ) : (
          <Typography variant="caption" color="text.secondary">
            Click Generate to produce a summary from recent transcripts.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
