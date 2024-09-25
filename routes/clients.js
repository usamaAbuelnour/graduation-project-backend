const express = require("express");
const { getClient, setImage, updateClient } = require("../controllers/clients");
const auth = require("../middlewares/auth");
const { upload } = require("../config/multer");
const router = express.Router();

router.get("/", auth, getClient);
router.patch("/", auth, updateClient);
router.post("/personalImage", auth, upload.single("personalImage"), setImage);
router.post("/frontId", auth, upload.single("frontId"), setImage);
router.post("/backId", auth, upload.single("backId"), setImage);

module.exports = router;
