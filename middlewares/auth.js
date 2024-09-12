const { verify } = require("jsonwebtoken");
const util = require("util");
const CustomError = require("../utils/CustomError.js");
const jwtVerify = util.promisify(verify);

const auth = async (req, _, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.slice(7);
        try {
            const userPayload = await jwtVerify(token, process.env.JWT_SECRET);
            req.user = userPayload;
            next();
        } catch (err) {
            throw new CustomError(401, err.message);
        }
    } else throw new CustomError(401, "missing token!!");
};

module.exports = auth;
