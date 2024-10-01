const { Schema, SchemaTypes, model } = require("mongoose");

const projectSchema = {
    name: {
        type: SchemaTypes.String,
        required: true,
    },
    description: {
        type: SchemaTypes.String,
        required: true,
    },
    startDate: {
        type: SchemaTypes.String,
        required: true,
    },
    finishDate: {
        type: SchemaTypes.String,
        required: true,
    },
};

const engineerSchema = new Schema({
    userId: {
        type: SchemaTypes.ObjectId,
        ref: "user",
        required: true,
    },
    personalImage: {
        type: SchemaTypes.String,
        default: null,
    },
    governorate: {
        type: SchemaTypes.String,
        default: null,
    },
    phoneNumbers: {
        type: [SchemaTypes.String],
        default: null,
    },
    whatsAppPhoneNumbers: {
        type: [SchemaTypes.String],
        default: null,
    },
    profileOverview: {
        type: SchemaTypes.String,
        default: null,
    },
    skills: {
        type: [SchemaTypes.String],
        default: null,
    },
    workExperience: {
        type: [projectSchema],
        default: null,
    },
    verificationInfo: {
        type: SchemaTypes.ObjectId,
        ref: "engineer-verification-info",
        default: null,
    },
});

const EngineerModel = model("engineer", engineerSchema);

module.exports = EngineerModel;
