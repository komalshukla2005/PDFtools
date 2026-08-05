import bcrypt from 'bcryptjs';
import User from './User.js';

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });
  return user;
};

export const comparePassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

export const getAllUsersFromDb = async () => {
  return await User.find().select('-password');
};
