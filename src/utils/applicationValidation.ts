import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const handleValidationErrors = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  next();
};

export const validateAddApplication = [
  body('name')
    .not()
    .isEmpty()
    .withMessage('Application name is required')
    .isLength({ min: 3 })
    .withMessage('Application name must be at least 3 characters long'),
  handleValidationErrors
];

export const validateUpdateApplication = [
  body('name')
    .not()
    .isEmpty()
    .withMessage('Application name is required')
    .isLength({ min: 3 })
    .withMessage('Application name must be at least 3 characters long'),
  
  handleValidationErrors
];