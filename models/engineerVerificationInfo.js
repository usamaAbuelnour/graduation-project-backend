const { Schema, SchemaTypes, model } = require("mongoose");

const engineerVerificationInfoSchema = new Schema({
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
    unionCard: {
        type: SchemaTypes.String,
        default: null,
    },
    militaryCert: {
        type: SchemaTypes.String,
        default: null,
    },
    graduationCert: {
        type: SchemaTypes.String,
        default: null,
    },
});

const EngineerVerificationInfoModel = model(
    "engineer-verification-info",
    engineerVerificationInfoSchema
);

module.exports = EngineerVerificationInfoModel;
