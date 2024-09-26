const { Schema, SchemaTypes, model } = require("mongoose");

const proposalSchema = new Schema({
    userId: {
        type: SchemaTypes.ObjectId,
        ref: "user",
        required: true,
    },
    jobId: {
        type: SchemaTypes.ObjectId,
        ref: "job",
        required: true,
    },
    coverLetter: {
        type: SchemaTypes.String,
        required: true,
    },
    totalCost: {
        type: SchemaTypes.Number,
        required: true,
    },
    status: {
        type: SchemaTypes.String,
        default: "pending",
    },
});

const ProposalModel = model("proposal", proposalSchema);

module.exports = ProposalModel;
