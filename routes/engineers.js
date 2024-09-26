const express = require("express");
const { upload } = require("../config/multer");
const {
    getEngineer,
    updateEngineer,
    setImage,
} = require("../controllers/engineers");
const router = express.Router();

router.get("/", getEngineer);
router.patch("/", updateEngineer);
router.post("/personalImage", upload.single("personalImage"), setImage);
router.post("/frontId", upload.single("frontId"), setImage);
router.post("/backId", upload.single("backId"), setImage);

module.exports = router;
