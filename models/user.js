const { model, Schema, SchemaTypes } = require("mongoose");
const { hash } = require("bcrypt");

const userSchema = new Schema(
    {
        firstName: {
            type: SchemaTypes.String,
            required: true,
        },
        lastName: {
            type: SchemaTypes.String,
            required: true,
        },
        email: {
            type: SchemaTypes.String,
            required: true,
        },
        password: {
            type: SchemaTypes.String,
            required: true,
        },
        role: {
            type: SchemaTypes.String,
            default: "user",
        },
        clientId: {
            type: SchemaTypes.ObjectId,
            ref: "client",
        },
        engineerId: {
            type: SchemaTypes.ObjectId,
            ref: "engineer",
        },
        verificationStatus: {
            type: SchemaTypes.String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.virtual("formattedCreatedAt").get(function () {
    return new Date(this.createdAt).toLocaleString("en-GB", {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
});

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await hash(this.password, 10);
    }
});

const UserModel = model("user", userSchema);

module.exports = UserModel;
