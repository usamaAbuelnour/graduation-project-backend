const { Schema, SchemaTypes, model } = require("mongoose");

const addressSchema = new Schema({
    governorate: {
        type: SchemaTypes.String,
        required: true,
    },
    region: {
        type: SchemaTypes.String,
        required: true,
    },
    building: {
        type: SchemaTypes.String,
        required: true,
    },
    apartment: {
        type: SchemaTypes.Number,
        required: true,
    },
});

const clientSchema = new Schema({
    userId: {
        type: SchemaTypes.ObjectId,
        ref: "user",
        required: true,
    },
    address: {
        type: addressSchema,
        required: true,
    },
    phoneNumbers: {
        type: [SchemaTypes.String],
        required: true,
    },
    idCard: {
        type: SchemaTypes.ObjectId,
        ref: "client-id-card",
        required: true,
    },
});

const ClientModel = model("client", clientSchema);

module.exports = ClientModel;
