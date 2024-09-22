const Yup = require("yup");

const clientValidationSchema = Yup.object()
    .shape({
        address: Yup.object()
            .shape({
                governorate: Yup.string().required(
                    "Governorate is a required field!"
                ),
                region: Yup.string().required("Region is a required field!"),
                building: Yup.string().required(
                    "Building is a required field!"
                ),
                apartment: Yup.string().required(
                    "Apartment is a required field!"
                ),
            })
            .required(),
        phoneNumbers: Yup.array()
            .of(
                Yup.string().matches(
                    /^(\+?2?01[0125][0-9]{8})$|^(\+?2?0[2-9][0-9]{7,8})$/,
                    "Invalid phone number!!"
                )
            )
            .min(1, "At least one phone number is required")
            .required(),
    })
    .noUnknown();

module.exports = clientValidationSchema;
