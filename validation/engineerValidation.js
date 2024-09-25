const Yup = require("yup");

const engineerValidationSchema = Yup.object()
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
                "phone numbers duplication isn't allowed!",
                (value) => {
                    if (!value || value.length === 0) return true;
                    return new Set(value).size === value.length;
                }
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
                (value) => {
                    if (!value || value.length === 0) return true;
                    return new Set(value).size === value.length;
                }
            ),
        profileOverview: Yup.string(),
        skills: Yup.array()
            .of(Yup.string())
            .min(1, "At least one skills is required")
            .max(6, "At most six skills are required")
            .test(
                "uniqueness",
                "whatsapp phone numbers duplication isn't allowed!",
                (value) => {
                    if (!value || value.length === 0) return true;
                    return new Set(value).size === value.length;
                }
            ),
        workExperience: Yup.object()
            .shape({
                name: Yup.string(),
                description: Yup.string(),
                startDate: Yup.string(),
                finishDate: Yup.string(),
            })
            .default(undefined)
            .test(
                "workExperience-required-fields",
                "All fields inside workExperience must be filled when workExperience is provided", // Error message
                function (value) {
                    if (value === undefined) return true;
                    if (!Object.keys(value).length) return false;

                    const { name, description, startDate, finishDate } = value;
                    return !!(name && description && startDate && finishDate); // Ensure all fields are non-empty
                }
            ),
    })
    .noUnknown();

module.exports = engineerValidationSchema;
