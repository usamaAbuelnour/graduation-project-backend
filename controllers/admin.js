const { compare } = require("bcrypt");
const generateToken = require("../utils/generateToken");
const UserModel = require("../models/user");
const { loginValidationSchema } = require("../validation/userValidate");
const CustomError = require("../errors/CustomError");

const login = async (req, res) => {
    try {
        await loginValidationSchema.validate(req.body);
    } catch (error) {
        throw new CustomError(422, error.message);
    }
    const { email, password } = req.body;
    const admin = await UserModel.findOne({ email });

    if (admin && (await compare(password, admin.password))) {
        if (admin.role === "user")
            throw new CustomError(403, "Normal users are not welcome here!!");
        res.send({
            id: admin._id,
            email: admin.email,
            token: await generateToken(admin._id),
        });
    } else throw new CustomError(401, "email or password is incorrect");
};

module.exports = { login };
