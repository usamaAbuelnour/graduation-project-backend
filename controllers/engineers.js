const EngineerModel = require("../models/engineer.js");
const UserModel = require("../models/user");
const { imagekit } = require("../config/multer");
const engineerValidationSchema = require("../validation/engineerValidation.js");
const CustomError = require("../errors/CustomError.js");
const EngineerVerificationInfoModel = require("../models/engineerVerificationInfo.js");
const doesImageExist = require("../utils/doesImageExist.js");

const getEngineer = async (req, res) => {
    const { id: userId } = req.user;

    const user = await UserModel.findById(userId);
    if (!user) return res.send("No Engineer found!!");

    const engineer = await UserModel.findOne(
        {
            _id: userId,
            engineerId: { $exists: true },
        },
        { password: false, role: false }
    ).populate({
        path: "engineerId",
        select: "-__v -_id -userId",
        populate: {
            path: "verificationInfo",
            select: "-__v -_id -userId",
        },
    });
    if (engineer)
        return res.send({
            ...engineer._doc,
            createdAt: engineer.formattedCreatedAt,
        });
    res.send("No info found about this engineer!!");
};

const updateEngineer = async (req, res) => {
    try {
        await engineerValidationSchema.validate(req.body, {
            stripUnknown: false,
        });
    } catch (error) {
        throw new CustomError(422, error.message);
    }
    const { id: userId } = req.user;
    const existingUser = await UserModel.findOne(
        {
            _id: userId,
            engineerId: { $exists: true },
        },
        { password: false, role: false }
    );
    if (!existingUser) return res.send("no such user exists!!");

    if (!existingUser.engineerId) {
        const newEngineer = await EngineerModel.create({
            userId,
            ...req.body,
        });
        existingUser.set({ engineerId: newEngineer._id });
        await existingUser.save();
    } else await EngineerModel.findOneAndUpdate({ userId }, req.body);

    res.send(
        await existingUser.populate({
            path: "engineerId",
            select: "-__v -_id -userId -verificationInfo -workExperience._id",
        })
    );
};

const setVerificationInfo = async (req, res) => {
    const { id: userId } = req.user;
    const existingVerificationInfo =
        await EngineerVerificationInfoModel.findOne({
            userId,
        });
    if (!existingVerificationInfo)
        throw new CustomError(400, "There's no info to validate!!!");
    for (const key in existingVerificationInfo._doc) {
        if (existingVerificationInfo[key] === null)
            throw new CustomError(400, `Missing ${key}!!!`);
    }
    const existingUser = await UserModel.findById(userId);
    if (
        !existingUser.verificationState.status ||
        existingUser.verificationState.status === "rejected"
    ) {
        existingUser.set({ "verificationState.status": "pending" });
        await existingUser.save();
        return res.send(
            "Info sent successfully, please wait for verification confirmation ^_^"
        );
    }
    if (existingUser.verificationState.status === "pending")
        return res.send("Please wait for verification confirmation ^_^");

    if (existingUser.verificationState.status === "accepted")
        return res.status(409).send("You're already verified!!");
};

const setImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    const { id: userId } = req.user;

    const user = await UserModel.findById(userId);
    let mainFolderPath =
        ("clientId" in user._doc ? "Client-" : "Engineer-") +
        user.email.replace(/[. @]/g, (char) => (char === "@" ? "_" : "-"));

    const imageId = await doesImageExist(req.file.fieldname, mainFolderPath);
    if (imageId) await imagekit.deleteFile(imageId);

    const image = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.fieldname,
        folder: mainFolderPath,
    });

    const existingUser = await UserModel.findOne({
        _id: userId,
        engineerId: { $exists: true },
    });

    if (req.file.fieldname === "personalImage") {
        if (!existingUser.engineerId) {
            const newEngineer = await EngineerModel.create({
                userId,
                personalImage: image.url,
            });
            existingUser.set({ engineerId: newEngineer._id });
            await existingUser.save();
        } else {
            await EngineerModel.findOneAndUpdate(
                { userId },
                { personalImage: image.url }
            );
        }
        return res.send(image.url);
    }
    if (!existingUser.engineerId) {
        const newVerificationInfo = await EngineerVerificationInfoModel.create({
            userId,
            [req.file.fieldname]: image.url,
        });
        const newEngineer = await EngineerModel.create({
            userId,
            verificationInfo: newVerificationInfo._id,
        });
        existingUser.set({ engineerId: newEngineer._id });
        await existingUser.save();
    } else {
        const existingVerificationInfo =
            await EngineerVerificationInfoModel.findOne({
                userId,
            });

        if (existingVerificationInfo) {
            existingVerificationInfo.set({
                [req.file.fieldname]: image.url,
            });
            await existingVerificationInfo.save();
        } else {
            const newVerificationInfo =
                await EngineerVerificationInfoModel.create({
                    userId,
                    [req.file.fieldname]: image.url,
                });
            await EngineerModel.findOneAndUpdate(
                { userId },
                { verificationInfo: newVerificationInfo._id }
            );
        }
    }

    res.send(image.url);
};

module.exports = { getEngineer, updateEngineer, setImage, setVerificationInfo };
