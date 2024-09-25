const express = require("express");
const auth = require("../middlewares/auth");
const { upload } = require("../config/multer");
const {
    getEngineer,
    updateEngineer,
    setImage,
} = require("../controllers/engineers");
const router = express.Router();

router.get("/", auth, getEngineer);
router.patch("/", auth, updateEngineer);
router.post("/personalImage", auth, upload.single("personalImage"), setImage);
router.post("/frontId", auth, upload.single("frontId"), setImage);
router.post("/backId", auth, upload.single("backId"), setImage);

module.exports = router;
