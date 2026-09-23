import rateLimit from "express-rate-limit";
const isTestEnv = process.env.NODE_ENV === "test";
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTestEnv,
  message: { error: "Too many requests, Please try again later" },
});

export const authLimiter = rateLimit({
  max: 10,
  windowMs: 10 * 60 * 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, Please try again later" },
  skip: () => isTestEnv,
});
