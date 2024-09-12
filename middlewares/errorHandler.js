const logger = require("../logs/logger");

const errorHandler = (err, _, res, next) => {
    logger.error(err.message);
    res.status(err.code || 500).send(err.message);
    next();
};

module.exports = errorHandler;
