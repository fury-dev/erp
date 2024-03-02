import jwt from "jsonwebtoken";
import userModel from "../schema/mongo/user";

export const createToken = (value: string): string => {
  return jwt.sign({ value }, process.env.SECRET_KEY || "Stack", {
    expiresIn: process.env.TOKEN_LIFESPAN,
  });
};

export const validateToken = async (value: string): Promise<any> => {
  const id = await jwt.verify(value, process.env.SECRET_KEY || "Stack");
  if (id) return id;
  return false;
};
export const isAuthenicatedUser = async (token: string): Promise<boolean> => {
  try {
    const id = await validateToken(token);
    if (!id) return id as boolean;
    await userModel.controller.findById(id.value);
    return true;
  } catch (err) {
    return false;
  }
};
