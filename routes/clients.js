const express = require("express");
const { getClient, setClient, setImage } = require("../controllers/clients");
const auth = require("../middlewares/auth");
const { upload } = require("../config/multer");
const router = express.Router();

router.get("/", auth, getClient);
router.post("/", auth, setClient);
router.post("/frontId", auth, upload.single("frontId"), setImage);
router.post("/backId", auth, upload.single("backId"), setImage);

module.exports = router;
