const { Schema, SchemaTypes, model } = require("mongoose");

const clientSchema = new Schema({
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
    verificationInfo: {
        type: SchemaTypes.ObjectId,
        ref: "client-verification-info",
        default: null,
    },
    jobsCount: {
        type: SchemaTypes.Number,
        default: 0
    }
});

const ClientModel = model("client", clientSchema);

module.exports = ClientModel;
