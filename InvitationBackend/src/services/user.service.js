const User = require('../models/user.model');

const getAllUsers = async () => {
  return await User.find().select('-password');
};

const createUser = async (userData) => {

  const user = new User({
    ...userData,
    password: userData.password,
  });

  return await user.save();
};


const getUserById = async (id) => {
  return await User.findById(id).select('-password');
};

const findUserByEmail = async (email) => {
    return await User.findOne({ email }).select('+password');
};

const updateUser = async (userId, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,          // Trả về document mới sau khi cập nhật
      runValidators: true,  // Chạy các quy tắc validate của schema
    }).select('-password'); // Luôn loại bỏ mật khẩu

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw error; // Ném lỗi để controller có thể bắt và xử lý
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  findUserByEmail,
  updateUser,
};
