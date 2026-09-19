import winston from "winston";
const { combine, timestamp, json, colorize, printf } = winston.format;

const consoleFormat =
  process.env.NODE_ENV === "production"
    ? combine(timestamp(), json())
    : combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format((info) => {
          info.level = info.level.toUpperCase();
          return info;
        })(),
        colorize(),
        printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      );

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "http" : "debug",
  format: consoleFormat,
  transports: [new winston.transports.Console()],
});

export default logger;
