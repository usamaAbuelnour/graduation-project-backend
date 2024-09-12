const winston = require("winston");
const { combine, timestamp, printf } = winston.format;

const logger = winston.createLogger({
    level: "info",
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.File({ filename: "./logs/logs.log" }),
    ],
});

module.exports = logger;
