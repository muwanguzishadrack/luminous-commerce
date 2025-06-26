import { body, param } from 'express-validator';

export const createOrganizationValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Organization name is required and must be between 1 and 100 characters'),
  
  body('slug')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must be 2-50 characters, lowercase letters, numbers, and hyphens only'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Website must be a valid URL'),
  
  body('phone')
    .optional()
    .trim()
    .isMobilePhone('any')
    .withMessage('Phone must be a valid phone number'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address must be less than 200 characters'),
  
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City must be less than 100 characters'),
  
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must be less than 100 characters'),
  
  body('timezone')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Timezone must be between 1 and 50 characters'),
  
  body('currency')
    .optional()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter currency code'),
];

export const updateOrganizationValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Organization name must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Website must be a valid URL'),
  
  body('phone')
    .optional()
    .trim()
    .isMobilePhone('any')
    .withMessage('Phone must be a valid phone number'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address must be less than 200 characters'),
  
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City must be less than 100 characters'),
  
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must be less than 100 characters'),
  
  body('timezone')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Timezone must be between 1 and 50 characters'),
  
  body('currency')
    .optional()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter currency code'),
];

export const addUserToOrganizationValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be between 1 and 50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be between 1 and 50 characters'),
  
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Valid phone number is required if provided'),
  
  body('role')
    .optional()
    .isIn(['OWNER', 'ADMIN', 'MANAGER', 'MEMBER'])
    .withMessage('Role must be one of: OWNER, ADMIN, MANAGER, MEMBER'),
];

export const updateUserRoleValidation = [
  body('role')
    .isIn(['OWNER', 'ADMIN', 'MANAGER', 'MEMBER'])
    .withMessage('Role must be one of: OWNER, ADMIN, MANAGER, MEMBER'),
  
  param('userId')
    .isLength({ min: 1 })
    .withMessage('User ID is required'),
];

export const organizationSlugValidation = [
  param('slug')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Invalid organization slug format'),
];

export const userIdValidation = [
  param('userId')
    .isLength({ min: 1 })
    .withMessage('User ID is required'),
];