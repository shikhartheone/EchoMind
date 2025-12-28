const express = require("express");
const { handleAskMeeting } = require("../controllers/qa.controller");

const router = express.Router();

router.post("/ask", handleAskMeeting);

module.exports = router;
