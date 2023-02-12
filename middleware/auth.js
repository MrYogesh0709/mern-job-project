import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";

const auth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const testUser = payload.userId === "63e7d6df1c7fde26d6f80eec";
    req.user = { userId: payload.userId, testUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

export default auth;
