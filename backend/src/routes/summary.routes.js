const express = require("express");
const { generateMeetingSummary } = require("../controllers/summary.controller");

const router = express.Router();

router.get("/summary", generateMeetingSummary);

module.exports = router;
