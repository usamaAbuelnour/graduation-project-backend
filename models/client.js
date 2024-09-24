const { Schema, SchemaTypes, model } = require("mongoose");

const clientSchema = new Schema({
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
    verificationInfo: {
        type: SchemaTypes.ObjectId,
        ref: "client-verification-info",
    },
});

const ClientModel = model("client", clientSchema);

module.exports = ClientModel;
