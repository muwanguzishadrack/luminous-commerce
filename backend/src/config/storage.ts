import { S3Client } from '@aws-sdk/client-s3';

// MinIO/S3 Configuration
const storageConfig = {
  endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
  accessKeyId: process.env.MINIO_ACCESS_KEY || '',
  secretAccessKey: process.env.MINIO_SECRET_KEY || '',
  region: process.env.MINIO_REGION || 'us-east-1',
  forcePathStyle: true, // Required for MinIO
};

// Validate required environment variables
const requiredEnvVars = ['MINIO_ENDPOINT', 'MINIO_ACCESS_KEY', 'MINIO_SECRET_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(`Warning: Missing MinIO environment variables: ${missingEnvVars.join(', ')}`);
  console.warn('File upload functionality will be disabled.');
}

// Create S3 client configured for MinIO
export const s3Client = new S3Client({
  endpoint: storageConfig.endpoint,
  region: storageConfig.region,
  credentials: {
    accessKeyId: storageConfig.accessKeyId,
    secretAccessKey: storageConfig.secretAccessKey,
  },
  forcePathStyle: storageConfig.forcePathStyle,
});

// Storage configuration constants
export const STORAGE_CONFIG = {
  BUCKET: process.env.MINIO_BUCKET || 'luminous-files',
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
  CDN_BASE_URL: process.env.MINIO_CDN_URL || process.env.MINIO_ENDPOINT,
} as const;

// Check if storage is properly configured
export const isStorageConfigured = (): boolean => {
  return missingEnvVars.length === 0;
};

// Get public URL for a file
export const getPublicUrl = (key: string): string => {
  const baseUrl = STORAGE_CONFIG.CDN_BASE_URL;
  return `${baseUrl}/${STORAGE_CONFIG.BUCKET}/${key}`;
};

export default {
  s3Client,
  STORAGE_CONFIG,
  isStorageConfigured,
  getPublicUrl,
};