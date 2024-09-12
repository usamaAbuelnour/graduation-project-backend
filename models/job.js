const { model, Schema, SchemaTypes } = require("mongoose");

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
    },
    { timestamps: true }
);

const JobModel = model("job", jobSchema);

module.exports = JobModel;
