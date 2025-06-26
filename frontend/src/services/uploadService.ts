import { api, ApiResponse, handleApiError } from '../lib/api';

export interface UploadResponse {
  url: string;
  message: string;
}

export interface UploadProgressCallback {
  (progress: number): void;
}

export class UploadService {
  /**
   * Upload organization logo
   */
  static async uploadLogo(
    file: File,
    onProgress?: UploadProgressCallback
  ): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await api.post<ApiResponse<UploadResponse>>(
        '/organizations/logo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(progress);
            }
          },
        }
      );

      return response.data.data!.url;
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  /**
   * Delete organization logo
   */
  static async deleteLogo(): Promise<void> {
    try {
      await api.delete('/organizations/logo');
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  /**
   * Upload product image
   */
  static async uploadProductImage(
    file: File,
    onProgress?: UploadProgressCallback
  ): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post<ApiResponse<UploadResponse>>(
        '/products/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(progress);
            }
          },
        }
      );

      return response.data.data!.url;
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  /**
   * Upload multiple product images
   */
  static async uploadProductImages(
    files: File[],
    onProgress?: UploadProgressCallback
  ): Promise<string[]> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const response = await api.post<ApiResponse<{ urls: string[] }>>(
        '/products/upload-images',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(progress);
            }
          },
        }
      );

      return response.data.data!.urls;
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  /**
   * Validate file before upload
   */
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    // Check file size (5MB for logos, 10MB for product images)
    const maxSize = file.name.includes('logo') ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxMB = maxSize / (1024 * 1024);
      return {
        valid: false,
        error: `File too large. Maximum size: ${maxMB}MB`,
      };
    }

    return { valid: true };
  }

  /**
   * Create file preview URL
   */
  static createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Revoke file preview URL
   */
  static revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Check if file is an image
   */
  static isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * Compress image before upload (optional)
   */
  static async compressImage(
    file: File,
    maxWidth: number = 1200,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;

        // Set canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw and compress
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

// Export instance for easier use
export const uploadService = UploadService;