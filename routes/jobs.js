const express = require("express");
const router = express.Router();
const {
    getJobs,
    setJob,
    updateJob,
    deleteJob,
} = require("../controllers/jobs");

const auth = require("../middlewares/auth");

router.get("/", auth, getJobs);
router.post("/", auth, setJob);
router.patch("/:id", auth, updateJob);
router.delete("/:id", auth, deleteJob);

module.exports = router;
