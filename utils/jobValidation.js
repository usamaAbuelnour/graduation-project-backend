const Yup = require("yup");

const createJobValidationSchema = Yup.object()
    .shape({
        title: Yup.string().required(),
        description: Yup.string().required(),
        location: Yup.string().required(),
    })
    .noUnknown();

const updateJobValidationSchema = Yup.object()
    .shape({
        title: Yup.string().optional(),
        description: Yup.string().optional(),
        location: Yup.string().optional(),
    })
    .noUnknown();

module.exports = { createJobValidationSchema, updateJobValidationSchema };
