import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export default function AppLayout({ children }) {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">EchoMind</Typography>
        </Toolbar>
      </AppBar>
      <Box p={4}>{children}</Box>
    </Box>
  );
}
