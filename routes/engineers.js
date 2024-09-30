const express = require("express");
const { upload } = require("../config/multer");
const {
    getEngineer,
    updateEngineer,
    setImage,
    setVerificationInfo,
} = require("../controllers/engineers");
const router = express.Router();

router.get("/", getEngineer);
router.patch("/", updateEngineer);
router.post("/personalImage", upload.single("personalImage"), setImage);
router.post("/frontId", upload.single("frontId"), setImage);
router.post("/backId", upload.single("backId"), setImage);
router.post("/unionCard", upload.single("unionCard"), setImage);
router.post("/militaryCert", upload.single("militaryCert"), setImage);
router.post("/graduationCert", upload.single("graduationCert"), setImage);
router.post("/verificationInfo", setVerificationInfo);

module.exports = router;
