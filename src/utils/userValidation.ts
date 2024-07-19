import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const handleValidationErrors = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }
    next();
};

export const validateUserSignIn = [
    body('email')
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email')
        .normalizeEmail(),
    body('password')
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isStrongPassword()
        .withMessage('Password must be at least 6 characters with an Upper case character, lower case character, symbol and digit.'),
    handleValidationErrors
];

export const validateUserSignUp = [
    body('surName')
        .isString()
        .withMessage('First name must be a string')
        .isLength({ min: 2 })
        .withMessage('First name is required'),
    body('givenName')
        .isString()
        .withMessage('Last name must be a string')
        .isLength({ min: 2 })
        .withMessage('Last name is required'),
    body('email')
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email')
        .normalizeEmail(),
    // body('phone')
    //     .not()
    //     .isEmpty()
    //     .withMessage('Phone number is required')
    //     .isLength({ min: 16, max: 16 })
    //     .withMessage('Invalid phone number'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .isStrongPassword()
        .withMessage('Password must be at least 6 characters with an Upper case character, lower case character, symbol and digit.'),
    body('addressLine1').optional().isString(),
    body('addressLine2').optional().isString(),
    body('city').optional().isString(),
    handleValidationErrors
];

export const validateUpdateUserInfo = [
    body('surName')
        .isString()
        .withMessage('First name must be a string')
        .isLength({ min: 2 })
        .withMessage('First name is required'),
    body('givenName')
        .isString()
        .withMessage('Last name must be a string')
        .isLength({ min: 2 })
        .withMessage('Last name is required'),
    body('email')
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email')
        .normalizeEmail(),
    // body('phone')
    //     .not()
    //     .isEmpty()
    //     .withMessage('Phone number is required')
    //     .isLength({ min: 16, max: 16 })
    //     .withMessage('Invalid phone number'),
    body('code')
        .optional()
        .isString()
        .isLength({ min: 6, max: 6 })
        .withMessage('Invalid code, payment code must be 6 characters long'),
    body('addressLine1').optional().isString(),
    body('addressLine2').optional().isString(),
    body('city').optional().isString(),
    handleValidationErrors
];

export const validateOTP = [
    body('otp')
        .isLength({ min: 6, max: 6 })
        .withMessage('Invalid otp'),
    handleValidationErrors
];

export const validateEmail = [
    body('email')
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email'),
    handleValidationErrors
];

export const validatePasswordReset = [
    body('password')
        .not()
        .isEmpty()
        .withMessage('Password must be provided')
        .isStrongPassword()
        .withMessage('Password must be at least 6 characters with an Upper case character, lower case character, symbol and digit.'),
    handleValidationErrors
];