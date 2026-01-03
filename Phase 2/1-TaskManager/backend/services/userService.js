import User from "../models/user.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};