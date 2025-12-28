import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";

export default function AppLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 15%, #f093fb 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background:
            "linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Toolbar sx={{ py: 2 }}>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, letterSpacing: 0.5, color: "white" }}
            >
              🎧 EchoMind
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.85)",
                display: "block",
                mt: 0.5,
              }}
            >
              Real-time Meeting Intelligence
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
