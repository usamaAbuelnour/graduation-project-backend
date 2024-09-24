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
    },
    governorate: {
        type: SchemaTypes.String,
    },
    phoneNumbers: {
        type: [SchemaTypes.String],
    },
    whatsAppPhoneNumbers: {
        type: [SchemaTypes.String],
    },
    profileOverview: {
        type: SchemaTypes.String,
    },
    skills: {
        type: [SchemaTypes.String],
    },
    workExperience: {
        type: [projectSchema],
    },
    verificationInfo: {
        type: SchemaTypes.ObjectId,
        ref: "engineer-verification-info",
    },
});

const EngineerModel = model("engineer", engineerSchema);

module.exports = EngineerModel;

// personalImage: multipart/fromdata
// profileOverview: string,
// skils: array[string] max 6,
// work experience: array[{projectName: string, projectDescription: string, date: from to }]
