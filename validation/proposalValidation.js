const { isValidObjectId } = require("mongoose");
const Yup = require("yup");

const proposalValidationSchema = Yup.object()
    .shape({
        jobId: Yup.string()
            .required()
            .test("is a valid id?", "invalid id!!", (value) =>
                isValidObjectId(value)
            ),
        coverLetter: Yup.string().required(),
        totalCost: Yup.number().required(),
    })
    .noUnknown();

module.exports = proposalValidationSchema;
