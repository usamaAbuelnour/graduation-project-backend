const UserModel = require("../models/user");

const checkRole = (roles) => async (req, res, next) => {
    const { id } = req.user;
    const { role } = await UserModel.findById(id, { role: true, _id: false });
    if (role && roles.includes(role)) return next();
    res.status(403).send("Not authorized");
};

module.exports = checkRole;
