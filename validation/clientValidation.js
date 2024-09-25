const Yup = require("yup");

const clientValidationSchema = Yup.object()
    .shape({
        governorate: Yup.string(),
        phoneNumbers: Yup.array()
            .of(
                Yup.string().matches(
                    /^(\+?2?01[0125][0-9]{8})$|^(\+?2?0[2-9][0-9]{7,8})$/,
                    "Invalid phone number!!"
                )
            )
            .min(1, "At least one phone number is required")
            .test(
                "uniqueness",
                "whatsapp phone numbers duplication isn't allowed!",
                (value) => new Set(value).size === value.length
            ),
        whatsAppPhoneNumbers: Yup.array()
            .of(
                Yup.string().matches(
                    /^(\+?2?01[0125][0-9]{8})$|^(\+?2?0[2-9][0-9]{7,8})$/,
                    "Invalid phone number!!"
                )
            )
            .min(1, "At least one phone number is required")
            .test(
                "uniqueness",
                "whatsapp phone numbers duplication isn't allowed!",
                (value) => new Set(value).size === value.length
            ),
    })
    .noUnknown();

module.exports = clientValidationSchema;
