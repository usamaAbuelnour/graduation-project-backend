const { Schema, SchemaTypes, model } = require("mongoose");

const clientVerificationInfoSchema = new Schema({
    userId: {
        type: SchemaTypes.ObjectId,
        ref: "user",
        required: true,
    },
    frontId: {
        type: SchemaTypes.String,
    },
    backId: {
        type: SchemaTypes.String,
    },
});

const ClientVerificationInfoModel = model(
    "client-verification-info",
    clientVerificationInfoSchema
);

module.exports = ClientVerificationInfoModel;
