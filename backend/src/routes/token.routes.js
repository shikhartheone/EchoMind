const router = require("express").Router();
const controller = require("../controllers/token.controller");

router.post("/getToken", controller.getToken);

module.exports = router;
