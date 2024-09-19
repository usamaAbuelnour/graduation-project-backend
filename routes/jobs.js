const express = require("express");
const router = express.Router();
const {
    getJobs,
    setJob,
    updateJob,
    deleteJob,
    getPaginatedJobs,
} = require("../controllers/jobs");

router.get("/", getJobs);
router.get("/paginated", getPaginatedJobs);
router.post("/", setJob);
router.patch("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;
