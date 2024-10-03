const { compare } = require("bcrypt");
const generateToken = require("../utils/generateToken");
const UserModel = require("../models/user");
const { loginValidationSchema } = require("../validation/userValidate");
const CustomError = require("../errors/CustomError");
const { isValidObjectId } = require("mongoose");
const adminAcceptOrRejectValidationSchema = require("../validation/adminAcceptOrRejectValidation");

const login = async (req, res) => {
    try {
        await loginValidationSchema.validate(req.body);
    } catch (error) {
        throw new CustomError(422, error.message);
    }
    const { email, password } = req.body;
    const admin = await UserModel.findOne({ email });

    if (admin && (await compare(password, admin.password))) {
        if (admin.role === "user")
            throw new CustomError(403, "Normal users are not welcome here!!");
        res.send({
            id: admin._id,
            name: admin.firstName,
            email: admin.email,
            token: await generateToken(admin._id),
        });
    } else throw new CustomError(401, "email or password is incorrect");
};

const getVerifyRequests = async (_, res, userType) => {
    const pendingUsers = await UserModel.find(
        {
            "verificationState.status": "pending",
            [userType == "client" ? "clientId" : "engineerId"]: {
                $exists: true,
            },
        },
        {
            firstName: true,
            lastName: true,
            email: true,
            [userType == "client" ? "clientId" : "engineerId"]: true,
        }
    ).populate({
        path: userType == "client" ? "clientId" : "engineerId",
        select: "-_id verificationInfo",
        populate: {
            path: "verificationInfo",
            select: "-_id -__v -userId",
        },
    });
    if (pendingUsers.length) return res.send(pendingUsers);
    res.send("No pending requests");
};

const acceptOrRejectVerifyRequests = async (req, res) => {
    const { id: userId } = req.params;
    const { status, remarks } = req.body;

    if (!isValidObjectId(userId))
        throw new CustomError(422, "Invalid user id!!");

    try {
        await adminAcceptOrRejectValidationSchema.validate(req.body, {
            stripUnknown: false,
        });
    } catch (error) {
        throw new CustomError(422, error.message);
    }

    const existingUser = await UserModel.findOne({
        _id: userId,
    });

    if (!existingUser) return res.status(404).send("no such user found");

    if (existingUser.verificationState.status !== "pending")
        return res.status(409).send("user verification is not pending!!");

    existingUser.set({
        "verificationState.status": status,
        "verificationState.remarks": remarks,
    });
    await existingUser.save();

    if (status === "accepted") return res.send("Request accepted");

    res.send("Request rejected");
};

module.exports = { login, getVerifyRequests, acceptOrRejectVerifyRequests };
