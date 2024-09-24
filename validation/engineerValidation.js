const Yup = require("yup");

const engineerValidationSchema = Yup.object()
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
            .notRequired(),
        whatsAppPhoneNumbers: Yup.array()
            .of(
                Yup.string().matches(
                    /^(\+?2?01[0125][0-9]{8})$|^(\+?2?0[2-9][0-9]{7,8})$/,
                    "Invalid phone number!!"
                )
            )
            .min(1, "At least one phone number is required")
            .notRequired(),
        profileOverview: Yup.string().notRequired(),
        skills: Yup.array()
            .of(Yup.string())
            .min(1, "At least one skills is required")
            .max(6, "At most six skills are required")
            .notRequired(),
        workExperience: Yup.object()
            .shape({
                name: Yup.string().required(),
                description: Yup.string().required(),
                startDate: Yup.string().required(),
                finishDate: Yup.string().required(),
            })
            .notRequired(),
    })
    .noUnknown();

module.exports = engineerValidationSchema;
