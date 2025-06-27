import { 
  S3Client, 
  PutObjectCommand, 
  DeleteObjectCommand, 
  HeadBucketCommand,
  CreateBucketCommand,
  GetObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import { s3Client, STORAGE_CONFIG, getPublicUrl } from '@/config/storage';

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
  size: number;
  contentType: string;
}

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export class StorageService {
  private s3: S3Client;

  constructor() {
    this.s3 = s3Client;
  }

  /**
   * Ensure main bucket exists, create if it doesn't
   */
  async ensureBucketExists(): Promise<void> {
    const bucket = STORAGE_CONFIG.BUCKET;
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: bucket }));
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        try {
          await this.s3.send(new CreateBucketCommand({ Bucket: bucket }));
          console.log(`Created S3 bucket: ${bucket}`);
        } catch (createError) {
          console.error(`Failed to create bucket ${bucket}:`, createError);
          throw new Error(`Failed to create S3 bucket: ${bucket}`);
        }
      } else {
        console.error(`Error checking bucket ${bucket}:`, error);
        throw new Error(`Failed to access S3 bucket: ${bucket}`);
      }
    }
  }

  /**
   * Optimize image using Sharp
   */
  async optimizeImage(
    buffer: Buffer,
    options: ImageOptimizationOptions = {}
  ): Promise<{ buffer: Buffer; contentType: string }> {
    const {
      width = 800,
      height,
      quality = 85,
      format = 'webp'
    } = options;

    let image = sharp(buffer);

    // Resize if dimensions provided
    if (width || height) {
      image = image.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Convert and optimize
    switch (format) {
      case 'jpeg':
        image = image.jpeg({ quality });
        break;
      case 'png':
        image = image.png({ quality });
        break;
      case 'webp':
      default:
        image = image.webp({ quality });
        break;
    }

    const optimizedBuffer = await image.toBuffer();
    const contentType = `image/${format}`;

    return { buffer: optimizedBuffer, contentType };
  }

  /**
   * Upload file to AWS S3
   */
  async uploadFile(
    key: string,
    buffer: Buffer,
    contentType: string,
    metadata: Record<string, string> = {}
  ): Promise<UploadResult> {
    await this.ensureBucketExists();

    const command = new PutObjectCommand({
      Bucket: STORAGE_CONFIG.BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: metadata,
    });

    try {
      await this.s3.send(command);
      
      const url = getPublicUrl(key);
      
      return {
        key,
        url,
        bucket: STORAGE_CONFIG.BUCKET,
        size: buffer.length,
        contentType,
      };
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw new Error('Failed to upload file to storage');
    }
  }

  /**
   * Upload and optimize logo
   */
  async uploadLogo(
    organizationId: string,
    buffer: Buffer,
    originalName: string,
    contentType: string
  ): Promise<UploadResult> {
    // Optimize image for logo use
    const { buffer: optimizedBuffer, contentType: optimizedContentType } = await this.optimizeImage(
      buffer,
      {
        width: 400,
        height: 400,
        quality: 90,
        format: 'webp'
      }
    );

    // Generate unique key with folder structure
    const timestamp = Date.now();
    const key = `${STORAGE_CONFIG.FOLDERS.IMAGES}/org-${organizationId}/logo-${timestamp}.webp`;

    const metadata = {
      'original-name': originalName,
      'organization-id': organizationId,
      'upload-type': 'logo',
      'upload-date': new Date().toISOString(),
    };

    return this.uploadFile(
      key,
      optimizedBuffer,
      optimizedContentType,
      metadata
    );
  }

  /**
   * Upload product image
   */
  async uploadProductImage(
    organizationId: string,
    productId: string,
    buffer: Buffer,
    originalName: string,
    contentType: string
  ): Promise<UploadResult> {
    // Optimize image for product use
    const { buffer: optimizedBuffer, contentType: optimizedContentType } = await this.optimizeImage(
      buffer,
      {
        width: 1200,
        height: 1200,
        quality: 85,
        format: 'webp'
      }
    );

    // Generate unique key with folder structure
    const timestamp = Date.now();
    const key = `${STORAGE_CONFIG.FOLDERS.PRODUCTS}/org-${organizationId}/${productId}/image-${timestamp}.webp`;

    const metadata = {
      'original-name': originalName,
      'organization-id': organizationId,
      'product-id': productId,
      'upload-type': 'product-image',
      'upload-date': new Date().toISOString(),
    };

    return this.uploadFile(
      key,
      optimizedBuffer,
      optimizedContentType,
      metadata
    );
  }

  /**
   * Delete file from storage
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: STORAGE_CONFIG.BUCKET,
      Key: key,
    });

    try {
      await this.s3.send(command);
      console.log(`Deleted file: ${STORAGE_CONFIG.BUCKET}/${key}`);
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw new Error('Failed to delete file from storage');
    }
  }

  /**
   * Delete logo by URL
   */
  async deleteLogoByUrl(logoUrl: string): Promise<void> {
    const key = this.extractKeyFromUrl(logoUrl);
    if (key) {
      await this.deleteFile(key);
    }
  }

  /**
   * Delete product image by URL
   */
  async deleteProductImageByUrl(imageUrl: string): Promise<void> {
    const key = this.extractKeyFromUrl(imageUrl);
    if (key) {
      await this.deleteFile(key);
    }
  }

  /**
   * Extract key from public URL
   */
  private extractKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const bucketIndex = pathParts.indexOf(STORAGE_CONFIG.BUCKET);
      
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        return pathParts.slice(bucketIndex + 1).join('/');
      }
      
      return null;
    } catch (error) {
      console.error('Failed to extract key from URL:', error);
      return null;
    }
  }

  /**
   * Generate presigned URL for direct upload (for large files)
   */
  async generatePresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    await this.ensureBucketExists();

    const command = new PutObjectCommand({
      Bucket: STORAGE_CONFIG.BUCKET,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }

  /**
   * Generate presigned URL for file download
   */
  async generatePresignedDownloadUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: STORAGE_CONFIG.BUCKET,
      Key: key,
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }

  /**
   * Initialize storage bucket
   */
  async initializeBucket(): Promise<void> {
    try {
      await this.ensureBucketExists();
      console.log(`✅ S3 bucket ready: ${STORAGE_CONFIG.BUCKET}`);
    } catch (error) {
      console.error(`❌ Failed to initialize S3 bucket ${STORAGE_CONFIG.BUCKET}:`, error);
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();