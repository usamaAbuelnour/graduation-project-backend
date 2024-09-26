const { model, Schema, SchemaTypes } = require("mongoose");
const { ref } = require("yup");

const jobSchema = new Schema(
    {
        userId: {
            type: SchemaTypes.ObjectId,
            ref: "user",
            required: true,
        },
        title: {
            type: SchemaTypes.String,
            required: true,
        },
        description: {
            type: SchemaTypes.String,
            required: true,
        },
        location: {
            type: SchemaTypes.String,
            required: true,
        },
        category: {
            type: SchemaTypes.String,
            required: true,
        },
        service: {
            type: [SchemaTypes.String],
            required: true,
        },
        proposals: {
            type: [
                {
                    type: SchemaTypes.ObjectId,
                    ref: "proposal",
                },
            ],
            default: [],
        },
    },
    { timestamps: true }
);

const JobModel = model("job", jobSchema);

module.exports = JobModel;
