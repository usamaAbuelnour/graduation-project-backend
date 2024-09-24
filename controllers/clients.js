const ClientModel = require("../models/client");
const UserModel = require("../models/user");
const { imagekit } = require("../config/multer");
const ClientIdCardModel = require("../models/clientVerificationInfo.js");
const clientValidationSchema = require("../validation/clientValidation.js");
const CustomError = require("../errors/CustomError.js");

const getClient = async (req, res) => {
    const { id: userId } = req.user;

    const user = await UserModel.findById(userId);
    if (!user) return res.send("No client found!!");

    const client = await UserModel.findOne(
        {
            _id: userId,
            clientId: { $exists: true },
        },
        { firstName: true, lastName: true, email: true, createdAt: true }
    ).populate({
        path: "clientId",
        select: "-__v -_id -userId",
    });

    if (client)
        return res.send({
            ...client._doc,
            createdAt: client.formattedCreatedAt,
        });
    res.send("No info about this client found!!");
};

const setClient = async (req, res) => {
    try {
        await clientValidationSchema.validate(req.body, {
            stripUnknown: false,
        });
    } catch (error) {
        throw new CustomError(422, error.message);
    }
    const { id: userId } = req.user;
    const existingUser = await UserModel.findOne({
        _id: userId,
        clientId: { $exists: true },
    });
    if (existingUser) return res.status(409).send("Client already exists!!");

    const clientIdCard = await ClientIdCardModel.findOne({
        userId,
        frontId: { $exists: true },
        backId: { $exists: true },
    });

    if (!clientIdCard)
        return res.status(400).send("You should upload your images first!!");

    const client = await ClientModel.create({
        userId,
        ...req.body,
        idCard: clientIdCard._id,
    });
    const userWithClientId = await UserModel.findByIdAndUpdate(
        userId,
        {
            clientId: client._id,
        },
        { new: true }
    )
        .populate("clientId")
        .populate("idCard");
    res.status(201).send(userWithClientId);
};

const setImage = async (req, res) => {
    console.log(req.user);
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    const { id: userId } = req.user;

    const { email } = await UserModel.findById(userId);

    const folder = email.replace(/[. @]/g, (char) =>
        char === "@" ? "_" : "-"
    );

    const image = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.fieldname,
        folder,
    });

    const existingIdCard = await ClientIdCardModel.findOne({ userId });
    if (existingIdCard) {
        existingIdCard.set({
            [req.file.fieldname]: image.url,
        });
        await existingIdCard.save();
    } else
        await ClientIdCardModel.create({
            userId,
            [req.file.fieldname]: image.url,
        });

    res.send(image.url);
};

module.exports = { getClient, setClient, setImage };
