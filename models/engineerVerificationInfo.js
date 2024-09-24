const { Schema, SchemaTypes, model } = require("mongoose");

const engineerVerificationInfoSchema = new Schema({
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
    unionCard: {
        type: SchemaTypes.String,
    },
    graduationCertificate: {
        type: SchemaTypes.String,
    },
});

const EngineerVerificationInfoModel = model(
    "engineer-verification-info",
    engineerVerificationInfoSchema
);

module.exports = EngineerVerificationInfoModel;
