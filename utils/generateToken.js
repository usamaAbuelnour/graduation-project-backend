const util = require("util");
const { sign } = require("jsonwebtoken");
const jwtSign = util.promisify(sign);

const generateToken = async (id, secret = process.env.JWT_SECRET) =>
    await jwtSign({ id }, secret, { expiresIn: "60d" });

module.exports = generateToken;
