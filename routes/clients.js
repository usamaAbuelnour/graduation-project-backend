const express = require("express");
const { getClient, setImage, updateClient } = require("../controllers/clients");
const { upload } = require("../config/multer");
const router = express.Router();

router.get("/", getClient);
router.patch("/", updateClient);
router.post("/personalImage", upload.single("personalImage"), setImage);
router.post("/frontId", upload.single("frontId"), setImage);
router.post("/backId", upload.single("backId"), setImage);

module.exports = router;
