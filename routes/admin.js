const express = require("express");
const router = express.Router();
const {
    login,
    getVerifyRequests,
    acceptOrRejectVerifyRequests,
} = require("../controllers/admin");
const auth = require("../middlewares/auth");
const checkRole = require("../middlewares/checkRole");

router.post("/login", login);

router.get("/clientsVerifyRequests", auth, checkRole(["admin"]), (req, res) =>
    getVerifyRequests(req, res, "client")
);

router.get("/engineersVerifyRequests", auth, checkRole(["admin"]), (req, res) =>
    getVerifyRequests(req, res, "engineer")
);
router.patch(
    "/verifyRequests/:id",
    auth,
    checkRole(["admin"]),
    acceptOrRejectVerifyRequests
);

module.exports = router;
