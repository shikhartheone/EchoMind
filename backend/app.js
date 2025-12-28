const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", require("./src/routes/token.routes"));
app.use("/api", require("./src/routes/summary.routes"));
app.use("/api", require("./src/routes/qa.routes"));

module.exports = app;
