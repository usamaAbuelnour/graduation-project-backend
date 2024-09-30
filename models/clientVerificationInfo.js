const { Schema, SchemaTypes, model } = require("mongoose");

const clientVerificationInfoSchema = new Schema({
    userId: {
        type: SchemaTypes.ObjectId,
        ref: "user",
        required: true,
    },
    frontId: {
        type: SchemaTypes.String,
        default: null,
    },
    backId: {
        type: SchemaTypes.String,
        default: null,
    },
});

const ClientVerificationInfoModel = model(
    "client-verification-info",
    clientVerificationInfoSchema
);

module.exports = ClientVerificationInfoModel;
