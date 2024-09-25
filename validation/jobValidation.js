const Yup = require("yup");

const createJobValidationSchema = Yup.object()
    .shape({
        title: Yup.string().required(),
        description: Yup.string().required(),
        location: Yup.string()
            .required()
            .oneOf([
                "portfouad",
                "portsaid",
                "suez",
                "10th of ramadan",
                "el shrok",
                "el obour",
                "new capital",
                "badr",
                "5th settlement",
                "nasr city",
            ]),
        category: Yup.string()
            .required()
            .oneOf([
                "Concrete Construction",
                "Consultation",
                "Finishing Works",
            ]),
        service: Yup.array()
            .of(Yup.string())
            .when("category", {
                is: "Concrete Construction",
                then: (schema) =>
                    schema
                        .min(1, "At least one service is required!")
                        .of(
                            Yup.string().oneOf([
                                "Reinforced Concrete Pouring",
                                "Concrete Leveling",
                                "Concrete Structure Repairs",
                            ])
                        )
                        .test(
                            "uniqueness",
                            "service duplication isn't allowed!",
                            (value) => new Set(value).size === value.length
                        ),

                otherwise: (schema) =>
                    schema.when("category", {
                        is: "Consultation",
                        then: (schema) =>
                            schema
                                .min(1, "At least one service is required!")
                                .of(
                                    Yup.string().oneOf([
                                        "Concrete Structure Design",
                                        "Infrastructure Consultation",
                                        "Construction Project Management",
                                    ])
                                )
                                .test(
                                    "uniqueness",
                                    "phone numbers duplication isn't allowed!",
                                    (value) =>
                                        new Set(value).size === value.length
                                ),
                        otherwise: (schema) =>
                            schema.when("category", {
                                is: "Finishing Works",
                                then: (schema) =>
                                    schema
                                        .min(
                                            1,
                                            "At least one service is required!"
                                        )
                                        .of(
                                            Yup.string().oneOf([
                                                "Interior and Exterior Finishing Services",
                                                "Plumbing Services",
                                                "Masonry Services",
                                            ])
                                        )
                                        .test(
                                            "uniqueness",
                                            "service duplication isn't allowed!",
                                            (value) =>
                                                new Set(value).size ===
                                                value.length
                                        ),
                            }),
                    }),
            }),
    })
    .noUnknown();

const updateJobValidationSchema = Yup.object()
    .shape({
        title: Yup.string().optional(),
        description: Yup.string().optional(),
        location: Yup.string()
            .optional()
            .oneOf([
                "portfouad",
                "portsaid",
                "suez",
                "10th of ramadan",
                "el shrok",
                "el obour",
                "new capital",
                "badr",
                "5th settlement",
                "nasr city",
            ]),
    })
    .noUnknown();

module.exports = { createJobValidationSchema, updateJobValidationSchema };
