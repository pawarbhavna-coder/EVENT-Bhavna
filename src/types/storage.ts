// Storage-related types for EventEase

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface StorageConfig {
  bucket: string;
  folder?: string;
  maxSizeBytes?: number;
  allowedTypes?: string[];
}

export interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    eTag: string;
    size: number;
    mimetype: string;
    cacheControl: string;
    lastModified: string;
    contentLength: number;
    httpStatusCode: number;
  };
}

export interface ListFilesResult {
  data: StorageFile[] | null;
  error: string | null;
}

// Storage bucket configurations
export const STORAGE_BUCKETS = {
  EVENT_IMAGES: 'event-images',
  PROFILE_PICTURES: 'profile-pictures',
  BANNERS: 'banners',
  DOCUMENTS: 'documents'
} as const;

export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];

// File type categories
export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALL_IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
} as const;

export type FileTypeCategory = keyof typeof FILE_TYPES;

// Storage service method types
export interface StorageServiceMethods {
  uploadEventImage: (file: File, eventId?: string) => Promise<UploadResult>;
  uploadProfilePicture: (file: File, userId: string) => Promise<UploadResult>;
  uploadBanner: (file: File, customPath?: string) => Promise<UploadResult>;
  uploadDocument: (file: File, customPath?: string) => Promise<UploadResult>;
  deleteEventImage: (path: string) => Promise<UploadResult>;
  deleteProfilePicture: (path: string) => Promise<UploadResult>;
  getEventImageUrl: (path: string) => string;
  getProfilePictureUrl: (path: string) => string;
  getBannerUrl: (path: string) => string;
  getDocumentUrl: (path: string) => string;
}

