const userService = require('../services/user.service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // Dùng service để tạo user (service sẽ handle việc hash password)
    const newUser = await userService.createUser({ username, email, password });
    res.status(201).json({ message: 'User registered successfully!', userId: newUser._id });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  res.clearCookie('token', { 
    httpOnly: true, 
    // secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax', 
    path: '/'
  })
  .status(200) // Gửi mã trạng thái thành công
  .json({ message: 'Logged out successfully' });

};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed. User not found.' });
    }

    // So sánh mật khẩu đã hash
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Authentication failed. Wrong password!' });
    }

    // Tạo token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    user.password = undefined;

    res.cookie('token', token, {
        httpOnly: true, 
        // secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax', 
        maxAge: 3600000,
        path: '/'
    })
    .json({
        message: "Logged in successfully!",
        user: {
            _id: user._id,
            username: user.username,
            email: user.email
        }
    });



  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout };