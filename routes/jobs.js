const express = require("express");
const router = express.Router();
const {
    getJobs,
    setJob,
    updateJob,
    deleteJob,
} = require("../controllers/jobs");

router.get("/", getJobs);
router.post("/", setJob);
router.patch("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;
