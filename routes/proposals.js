const express = require("express");
const router = express.Router();
const {
    getProposals,
    setProposal,
    acceptOrRejectProposal,
} = require("../controllers/proposals");

router.get("/", getProposals);
router.post("/", setProposal);
router.patch("/:id", acceptOrRejectProposal);

module.exports = router;
