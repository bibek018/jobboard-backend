import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken = (user) => {
  const accessToken = jwt.sign(
    {
      _id: user._id,
      role: user.role,
    },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "15m",
    },
  );
  return accessToken;
};
export const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    {
      _id: user._id,
      jti: crypto.randomUUID(),
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );
  return refreshToken;
};
