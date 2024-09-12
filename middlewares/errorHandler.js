const errorHandler = (err, _, res, next) => {
    res.status(err.code || 500).send(err.message);
    next();
};

module.exports = errorHandler;
