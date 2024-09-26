const express = require("express");
const router = express.Router();
const {
    getMyJobs,
    getAllJobs,
    setJob,
    updateJob,
    deleteJob,
} = require("../controllers/jobs");

router.get("/", getMyJobs);
router.get("/all", getAllJobs);
router.post("/", setJob);
router.patch("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;
