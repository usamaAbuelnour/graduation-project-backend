const Yup = require("yup");

const adminAcceptOrRejectValidationSchema = Yup.object()
    .shape({
        status: Yup.string().oneOf(["accepted", "rejected"]).required(),
        remarks: Yup.string().notRequired(),
    })
    .noUnknown();

module.exports = adminAcceptOrRejectValidationSchema;
