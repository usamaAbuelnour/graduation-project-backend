const { Schema, SchemaTypes, model } = require("mongoose");

const clientIdCardSchema = new Schema({
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

const ClientIdCardModel = model("client-id-card", clientIdCardSchema);

module.exports = ClientIdCardModel;
