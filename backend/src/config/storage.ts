import { S3Client } from '@aws-sdk/client-s3';

// AWS S3 Configuration
const storageConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: process.env.AWS_REGION || 'us-east-1',
};

// Validate required environment variables
const requiredEnvVars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_S3_BUCKET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(`Warning: Missing AWS S3 environment variables: ${missingEnvVars.join(', ')}`);
  console.warn('File upload functionality will be disabled.');
}

// Create S3 client
export const s3Client = new S3Client({
  region: storageConfig.region,
  credentials: {
    accessKeyId: storageConfig.accessKeyId,
    secretAccessKey: storageConfig.secretAccessKey,
  },
});

// Storage configuration constants
export const STORAGE_CONFIG = {
  BUCKET: process.env.AWS_S3_BUCKET || 'luminous-files',
  FOLDERS: {
    IMAGES: 'images',
    PRODUCTS: 'products',
    DOCUMENTS: 'documents',
  },
  UPLOAD_LIMITS: {
    LOGO_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    PRODUCT_IMAGE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
    DOCUMENT_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  },
  ALLOWED_MIME_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  CDN_BASE_URL: process.env.AWS_CLOUDFRONT_URL || `https://${process.env.AWS_S3_BUCKET}.s3.${storageConfig.region}.amazonaws.com`,
} as const;

// Check if storage is properly configured
export const isStorageConfigured = (): boolean => {
  return missingEnvVars.length === 0;
};

// Get public URL for a file
export const getPublicUrl = (key: string): string => {
  const baseUrl = STORAGE_CONFIG.CDN_BASE_URL;
  // If using CloudFront, the URL structure is different
  if (process.env.AWS_CLOUDFRONT_URL) {
    return `${baseUrl}/${key}`;
  }
  // Standard S3 URL
  return `${baseUrl}/${key}`;
};

export default {
  s3Client,
  STORAGE_CONFIG,
  isStorageConfigured,
  getPublicUrl,
};