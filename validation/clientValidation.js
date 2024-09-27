const Yup = require("yup");

const clientValidationSchema = Yup.object()
    .shape({
        governorate: Yup.string().notRequired(),
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
                "phone numbers duplication isn't allowed!",
                (value) => {
                    if (!value || value.length === 0) return true;
                    return new Set(value).size === value.length;
                }
            )
            .notRequired(),
        whatsAppPhoneNumbers: Yup.array()
            .of(
                Yup.string().matches(
                    /^(\+?2?01[0125][0-9]{8})$|^(\+?2?0[2-9][0-9]{7,8})$/,
                    "Invalid whatsapp phone number!!"
                )
            )
            .min(1, "At least whatsapp one phone number is required")
            .test(
                "uniqueness",
                "whatsapp phone numbers duplication isn't allowed!",
                (value) => {
                    if (!value || value.length === 0) return true;
                    return new Set(value).size === value.length;
                }
            )
            .notRequired(),
    })
    .noUnknown();

module.exports = clientValidationSchema;
