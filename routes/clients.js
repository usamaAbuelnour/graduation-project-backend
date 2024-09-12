const express = require("express");
const { getClient, setClient } = require("../controllers/clients");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/:id", getClient);
router.post("/", auth, setClient);

module.exports = router;
