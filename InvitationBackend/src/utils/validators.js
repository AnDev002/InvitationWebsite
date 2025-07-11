const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateUser = [
  body('email').isEmail().withMessage('Please enter a valid email.'),
  body('username').trim().not().isEmpty().withMessage('Username is required.'),
  body('password')
    .isLength({ min: 8 }).withMessage('Mật khẩu phải có ít nhất 8 ký tự, bao gồm một chữ số, một chữ cái viết thường, một chứ cái viết hoa và một ký tự đặc biệt.')
    .matches(/\d/).withMessage('Mật khẩu phải có ít nhất 8 ký tự, bao gồm một chữ số, một chữ cái viết thường, một chứ cái viết hoa và một ký tự đặc biệt.')
    .matches(/[a-z]/).withMessage('Mật khẩu phải có ít nhất 8 ký tự, bao gồm một chữ số, một chữ cái viết thường, một chứ cái viết hoa và một ký tự đặc biệt.')
    .matches(/[A-Z]/).withMessage('Mật khẩu phải có ít nhất 8 ký tự, bao gồm một chữ số, một chữ cái viết thường, một chứ cái viết hoa và một ký tự đặc biệt.')
    .matches(/[^a-zA-Z0-9]/).withMessage('Mật khẩu phải có ít nhất 8 ký tự, bao gồm một chữ số, một chữ cái viết thường, một chứ cái viết hoa và một ký tự đặc biệt.'),
  handleValidationErrors
];

const validateLogin = [
    body('email').isEmail().withMessage('Please enter a valid email.'),
    body('password').not().isEmpty().withMessage('Password is required.'),
    handleValidationErrors
];

const validateProduct = [
  body('name').trim().not().isEmpty().withMessage('Product name is required.'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number.'),
  body('description').trim().not().isEmpty().withMessage('Description is required.'),
  handleValidationErrors
];

module.exports = { validateUser, validateLogin, validateProduct };