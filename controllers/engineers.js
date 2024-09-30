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

const setImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    const { id: userId } = req.user;

    const user = await UserModel.findById(userId);
    let mainFolderPath =
        ("clientId" in user._doc ? "Client-" : "Engineer-") +
        user.email.replace(/[. @]/g, (char) => (char === "@" ? "_" : "-"));

    let image;

    if (req.file.fieldname === "personalImage") {
        const personalImagesFolderPath = `${mainFolderPath}/personal-image`;
        try {
            // if (await doesImageKitFolderExist(personalImagesFolderPath))
            //     await imagekit.deleteFolder(personalImagesFolderPath);

            image = await imagekit.upload({
                file: req.file.buffer,
                fileName: req.file.fieldname,
                folder: personalImagesFolderPath,
            });
            const existingUser = await UserModel.findOne({
                _id: userId,
                engineerId: { $exists: true },
            });
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
        } catch (error) {
            throw new CustomError(500, error.message);
        }
    }

    image = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.fieldname,
        folder: mainFolderPath,
    });

    const existingVerificationInfo =
        await EngineerVerificationInfoModel.findOne({
            userId,
        });
    if (existingVerificationInfo) {
        existingVerificationInfo.set({
            [req.file.fieldname]: image.url,
        });
        await existingVerificationInfo.save();
    } else
        await EngineerVerificationInfoModel.create({
            userId,
            [req.file.fieldname]: image.url,
        });

    res.send(image.url);
};

module.exports = { getEngineer, updateEngineer, setImage };
