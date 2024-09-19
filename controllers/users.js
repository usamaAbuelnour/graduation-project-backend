const bcrypt = require("bcrypt");
const UserModel = require("../models/user.js");
const generateToken = require("../utils/generateToken.js");
const {
    registerValidationSchema,
    loginValidationSchema,
} = require("../utils/userValidate.js");
const CustomError = require("../utils/customError.js");

const register = async (req, res) => {
    try {
        await registerValidationSchema.validate(req.body);
    } catch (error) {
        throw new CustomError(422, error.message);
    }

    const { firstName, lastName, email, password, type } = req.body;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) throw new CustomError(409, "Email already exists!!");
    const userDocument = {
        firstName,
        lastName,
        email,
        password,
    };
    if (type === "client") userDocument.clientId = null;
    else userDocument.engineerId = null;

    const user = await UserModel.create(userDocument);
    if (user) {
        res.status(201).send({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            registeredAt: user.formattedCreatedAt,
            token: await generateToken(user._id),
        });
    }
};

const login = async (req, res) => {
    try {
        await loginValidationSchema.validate(req.body);
    } catch (error) {
        throw new CustomError(422, error.message);
    }

    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    console.log("clientId" in user._doc, user);
    if (user && (await bcrypt.compare(password, user.password))) {
        if (user.role === "admin")
            throw new CustomError(403, "Admins are not welcome here!!");

        res.send({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            registeredAt: user.formattedCreatedAt,
            token: await generateToken(user._id),
            ["clientId" in user._doc ? "clientId" : "engineerId"]:
                "clientId" in user._doc ? user.clientId : user.engineerId,
        });
    } else throw new CustomError(401, "email or password is incorrect");
};

module.exports = { login, register };
