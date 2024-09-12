const { isValidObjectId } = require("mongoose");
const ClientModel = require("../models/client");
const UserModel = require("../models/user");
const clientValidationSchema = require("../utils/clientValidation");
const CustomError = require("../utils/CustomError");

const getClient = async (req, res) => {
    const { id: userId } = req.params;
    if (!isValidObjectId(userId))
        throw new CustomError(400, "Invalid client id");

    const client = await UserModel.findById(userId).populate("clientId");
    if (client) return res.send(client);
    res.send("No such client found!!");
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

    const client = await ClientModel.create({ userId, ...req.body });
    const userWithClientId = await UserModel.findByIdAndUpdate(
        userId,
        {
            clientId: client._id,
        },
        { new: true }
    ).populate("clientId");
    res.status(201).send(userWithClientId);
};

module.exports = { getClient, setClient };
