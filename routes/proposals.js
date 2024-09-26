const express = require("express");
const router = express.Router();
const { getProposals, setProposal } = require("../controllers/proposals");

router.get("/", getProposals);
router.post("/", setProposal);

module.exports = router;
