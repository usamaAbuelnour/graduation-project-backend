const ClientModel = require("../models/client");
const UserModel = require("../models/user");
const { imagekit } = require("../config/multer");
const clientValidationSchema = require("../validation/clientValidation.js");
const CustomError = require("../errors/CustomError.js");
const ClientVerificationInfoModel = require("../models/clientVerificationInfo.js");
const doesImageKitFolderExist = require("../utils/doesImageKitFolderExist.js");

const getClient = async (req, res) => {
    const { id: userId } = req.user;

    const user = await UserModel.findById(userId);
    if (!user) return res.send("No client found!!");

    const client = await UserModel.findOne(
        {
            _id: userId,
            clientId: { $exists: true },
        },
        { password: false, role: false }
    ).populate({
        path: "clientId",
        select: "-__v -_id -userId",
    });

    if (client)
        return res.send({
            ...client._doc,
            createdAt: client.formattedCreatedAt,
        });
    res.send("No info found about this client!!");
};

const updateClient = async (req, res) => {
    try {
        await clientValidationSchema.validate(req.body, {
            stripUnknown: false,
        });
    } catch (error) {
        throw new CustomError(422, error.message);
    }
    const { id: userId } = req.user;
    const existingUser = await UserModel.findOne(
        {
            _id: userId,
            clientId: { $exists: true },
        },
        { password: false, role: false }
    );

    if (!existingUser) return res.send("no such user exists!!");

    if (!existingUser.clientId) {
        const newClient = await ClientModel.create({
            userId,
            ...req.body,
        });
        existingUser.set({ clientId: newClient._id });
        await existingUser.save();
    } else await ClientModel.findOneAndUpdate({ userId }, req.body);

    res.send(
        await existingUser.populate({
            path: "clientId",
            select: "-__v -_id -userId",
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
            if (await doesImageKitFolderExist(personalImagesFolderPath))
                await imagekit.deleteFolder(personalImagesFolderPath);

            image = await imagekit.upload({
                file: req.file.buffer,
                fileName: req.file.fieldname,
                folder: personalImagesFolderPath,
            });
            await ClientModel.findOneAndUpdate(
                { userId },
                { personalImage: image.url }
            );
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

    const existingVerificationInfo = await ClientVerificationInfoModel.findOne({
        userId,
    });
    if (existingVerificationInfo) {
        existingVerificationInfo.set({
            [req.file.fieldname]: image.url,
        });
        await existingVerificationInfo.save();
    } else
        await ClientVerificationInfoModel.create({
            userId,
            [req.file.fieldname]: image.url,
        });

    res.send(image.url);
};

module.exports = { getClient, updateClient, setImage };
