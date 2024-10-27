const express = require("express");
const router = express.Router();
const {
  getProposals,
  setProposal,
  acceptOrRejectProposal,
  confirmProposal,
} = require("../controllers/proposals");

router.get("/", getProposals);
router.post("/", setProposal);
router.patch("/:id", acceptOrRejectProposal);
router.patch("/confirm/:id", confirmProposal);

module.exports = router;
