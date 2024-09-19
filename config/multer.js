const multer = require("multer");
const ImageKit = require("imagekit");
const CustomError = require("../utils/customError");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter(req, file, callback) {
        const extensions = ["image/jpg", "image/jpeg", "image/png"];
        if (extensions.includes(file.mimetype)) callback(null, true);
        else
            callback(
                new CustomError(422, "Only JPEG and PNG images are allowed!"),
                false
            );
    },
});

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL,
});

module.exports = { upload, imagekit };
