import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { STORAGE_CONFIG } from '@/config/storage';

// Memory storage for processing before uploading to MinIO
const storage = multer.memoryStorage();

// File filter for images
const imageFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (STORAGE_CONFIG.ALLOWED_MIME_TYPES.IMAGES.includes(file.mimetype as any)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${STORAGE_CONFIG.ALLOWED_MIME_TYPES.IMAGES.join(', ')}`));
  }
};

// File filter for documents
const documentFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    ...STORAGE_CONFIG.ALLOWED_MIME_TYPES.IMAGES,
    ...STORAGE_CONFIG.ALLOWED_MIME_TYPES.DOCUMENTS
  ];
  
  if (allowedTypes.includes(file.mimetype as any)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
  }
};

// Logo upload middleware
export const uploadLogo = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: STORAGE_CONFIG.UPLOAD_LIMITS.LOGO_MAX_SIZE,
    files: 1,
  },
}).single('logo');

// Product image upload middleware
export const uploadProductImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: STORAGE_CONFIG.UPLOAD_LIMITS.PRODUCT_IMAGE_MAX_SIZE,
    files: 1,
  },
}).single('image');

// Multiple product images upload middleware
export const uploadProductImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: STORAGE_CONFIG.UPLOAD_LIMITS.PRODUCT_IMAGE_MAX_SIZE,
    files: 5, // Maximum 5 images per upload
  },
}).array('images', 5);

// Document upload middleware
export const uploadDocument = multer({
  storage,
  fileFilter: documentFilter,
  limits: {
    fileSize: STORAGE_CONFIG.UPLOAD_LIMITS.DOCUMENT_MAX_SIZE,
    files: 1,
  },
}).single('document');

// Generic file upload error handler
export const handleUploadError = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        res.status(400).json({
          success: false,
          message: 'File too large. Please choose a smaller file.',
          error: 'FILE_TOO_LARGE',
        });
        return;
      case 'LIMIT_FILE_COUNT':
        res.status(400).json({
          success: false,
          message: 'Too many files. Please select fewer files.',
          error: 'TOO_MANY_FILES',
        });
        return;
      case 'LIMIT_UNEXPECTED_FILE':
        res.status(400).json({
          success: false,
          message: 'Unexpected file field. Please check your form.',
          error: 'UNEXPECTED_FILE',
        });
        return;
      default:
        res.status(400).json({
          success: false,
          message: 'File upload error.',
          error: error.code,
        });
        return;
    }
  }

  if (error.message.includes('Invalid file type')) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: 'INVALID_FILE_TYPE',
    });
    return;
  }

  // Pass other errors to global error handler
  next(error);
};

// Middleware to check if file was uploaded
export const requireFile = (fieldName: string = 'file') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file && !req.files) {
      res.status(400).json({
        success: false,
        message: `No ${fieldName} uploaded. Please select a file.`,
        error: 'NO_FILE_UPLOADED',
      });
      return;
    }
    next();
  };
};

// Middleware to validate file exists for specific field
export const requireFileField = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: `No ${fieldName} uploaded. Please select a ${fieldName}.`,
        error: 'NO_FILE_UPLOADED',
      });
      return;
    }
    next();
  };
};

export default {
  uploadLogo,
  uploadProductImage,
  uploadProductImages,
  uploadDocument,
  handleUploadError,
  requireFile,
  requireFileField,
};