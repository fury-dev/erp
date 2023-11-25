import jwt = require("jsonwebtoken");
import userModel = require("../schema/mongo/user");

export const createToken = (value: string): string => {
  return jwt.sign({ value }, process.env.SECRET_KEY || "Stack", {
    expiresIn: process.env.TOKEN_LIFESPAN,
  });
};

export const validateToken = (value: string): any => {
  const id = jwt.verify(value, process.env.SECRET_KEY || "Stack");
  if (id) return id;
  return false;
};
export const isAuthenicatedUser = (token: string): boolean => {
  const id = validateToken(token);
  if (!id) return id as boolean;
  try {
    userModel.controller.findById(id.value);
    return true;
  } catch (err) {
    return false;
  }
};
