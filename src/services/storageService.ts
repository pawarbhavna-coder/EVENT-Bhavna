import { supabase } from '../lib/supabaseConfig';
import { 
  UploadResult, 
  FileValidationResult, 
  StorageConfig, 
  StorageFile, 
  ListFilesResult,
  STORAGE_BUCKETS,
  FILE_TYPES,
  StorageBucket,
  FileTypeCategory
} from '../types/storage';
import { Event, Speaker } from '../types/eventManagement';

// Default storage configurations for different use cases
export const STORAGE_CONFIGS: Record<string, StorageConfig> = {
  EVENT_IMAGES: {
    bucket: STORAGE_BUCKETS.EVENT_IMAGES,
    folder: 'events',
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedTypes: FILE_TYPES.IMAGES
  },
  PROFILE_PICTURES: {
    bucket: STORAGE_BUCKETS.PROFILE_PICTURES,
    folder: 'profiles',
    maxSizeBytes: 2 * 1024 * 1024, // 2MB
    allowedTypes: FILE_TYPES.IMAGES
  },
  BANNERS: {
    bucket: STORAGE_BUCKETS.BANNERS,
    folder: 'banners',
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedTypes: FILE_TYPES.IMAGES
  },
  DOCUMENTS: {
    bucket: STORAGE_BUCKETS.DOCUMENTS,
    folder: 'docs',
    maxSizeBytes: 20 * 1024 * 1024, // 20MB
    allowedTypes: FILE_TYPES.DOCUMENTS
  }
} as const;

/**
 * Validates a file against the provided configuration
 */
export const validateFile = (file: File, config: StorageConfig): FileValidationResult => {
  // Check file size
  if (config.maxSizeBytes && file.size > config.maxSizeBytes) {
    const maxSizeMB = (config.maxSizeBytes / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB`
    };
  }

  // Check file type
  if (config.allowedTypes && !config.allowedTypes.includes(file.type)) {
    const allowedTypes = config.allowedTypes.join(', ');
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes}`
    };
  }

  return { isValid: true };
};

/**
 * Generates a unique filename with timestamp and random string
 */
const generateUniqueFilename = (originalName: string, folder?: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const baseName = originalName.split('.').slice(0, -1).join('.');
  
  // Sanitize filename
  const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
  const filename = `${sanitizedBaseName}_${timestamp}_${randomString}.${extension}`;
  
  return folder ? `${folder}/${filename}` : filename;
};

/**
 * Check if a storage bucket exists by trying to access it directly
 */
const checkBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    // Try to list files in the bucket - if it works, the bucket exists
    const { error } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 1 });
    
    // If there's no error, the bucket exists
    return !error;
  } catch (error) {
    console.error('Error checking bucket existence:', error);
    return false;
  }
};

/**
 * Uploads a file to Supabase Storage
 */
export const uploadFile = async (
  file: File, 
  config: StorageConfig,
  customPath?: string
): Promise<UploadResult> => {
  try {
    // Check if bucket exists
    const bucketExists = await checkBucketExists(config.bucket);
    if (!bucketExists) {
      return {
        success: false,
        error: `Storage bucket '${config.bucket}' not found. Please set up storage buckets in Supabase dashboard. See STORAGE_SETUP.md for instructions.`
      };
    }

    // Validate file
    const validation = validateFile(file, config);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      };
    }

    // Generate file path
    const filePath = customPath || generateUniqueFilename(file.name, config.folder);

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(config.bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      
      // Provide more helpful error messages
      if (error.message.includes('Bucket not found')) {
        return {
          success: false,
          error: `Storage bucket '${config.bucket}' not found. Please set up storage buckets in Supabase dashboard. See STORAGE_SETUP.md for instructions.`
        };
      }
      
      if (error.message.includes('Permission denied')) {
        return {
          success: false,
          error: `Permission denied. Please check storage policies for bucket '${config.bucket}'. See STORAGE_SETUP.md for instructions.`
        };
      }
      
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(config.bucket)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error'
    };
  }
};

/**
 * Deletes a file from Supabase Storage
 */
export const deleteFile = async (bucket: string, path: string): Promise<UploadResult> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Storage delete error:', error);
      return {
        success: false,
        error: `Delete failed: ${error.message}`
      };
    }

    return {
      success: true
    };

  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown delete error'
    };
  }
};

/**
 * Gets a public URL for a file in storage
 */
export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

/**
 * Lists files in a storage bucket folder
 */
export const listFiles = async (bucket: string, folder?: string): Promise<ListFilesResult> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder);

    if (error) {
      console.error('Storage list error:', error);
      return { data: null, error: error.message };
    }

    return { data: data as StorageFile[], error: null };

  } catch (error) {
    console.error('List files error:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown list error' 
    };
  }
};

/**
 * Batch upload multiple files
 */
export const uploadMultipleFiles = async (
  files: File[],
  config: StorageConfig,
  customPath?: string
): Promise<{ results: UploadResult[]; successCount: number; errorCount: number }> => {
  const results: UploadResult[] = [];
  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const result = await uploadFile(file, config, customPath);
    results.push(result);
    
    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  return { results, successCount, errorCount };
};

/**
 * Upload event gallery images
 */
export const uploadEventGallery = async (
  files: File[],
  eventId: string
): Promise<{ results: UploadResult[]; successCount: number; errorCount: number }> => {
  const customPath = `events/${eventId}/gallery`;
  return uploadMultipleFiles(files, STORAGE_CONFIGS.EVENT_IMAGES, customPath);
};

/**
 * Upload speaker images
 */
export const uploadSpeakerImage = async (
  file: File,
  speakerId: string,
  eventId?: string
): Promise<UploadResult> => {
  const customPath = eventId 
    ? `events/${eventId}/speakers/${speakerId}/${file.name}`
    : `speakers/${speakerId}/${file.name}`;
  
  return uploadFile(file, STORAGE_CONFIGS.PROFILE_PICTURES, customPath);
};

/**
 * Upload organizer avatar
 */
export const uploadOrganizerAvatar = async (
  file: File,
  organizerId: string
): Promise<UploadResult> => {
  const customPath = `organizers/${organizerId}/avatar/${file.name}`;
  return uploadFile(file, STORAGE_CONFIGS.PROFILE_PICTURES, customPath);
};

/**
 * Get optimized image URL with transformations
 */
export const getOptimizedImageUrl = (
  bucket: string,
  path: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  }
): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  if (!options) {
    return data.publicUrl;
  }

  // Add transformation parameters
  const params = new URLSearchParams();
  if (options.width) params.append('width', options.width.toString());
  if (options.height) params.append('height', options.height.toString());
  if (options.quality) params.append('quality', options.quality.toString());
  if (options.format) params.append('format', options.format);

  const separator = data.publicUrl.includes('?') ? '&' : '?';
  return `${data.publicUrl}${separator}${params.toString()}`;
};

/**
 * Convenience methods for common upload scenarios
 */
export const storageService: {
  uploadEventImage: (file: File, eventId?: string) => Promise<UploadResult>;
  uploadProfilePicture: (file: File, userId: string) => Promise<UploadResult>;
  uploadBanner: (file: File, customPath?: string) => Promise<UploadResult>;
  uploadDocument: (file: File, customPath?: string) => Promise<UploadResult>;
  uploadEventGallery: (files: File[], eventId: string) => Promise<{ results: UploadResult[]; successCount: number; errorCount: number }>;
  uploadSpeakerImage: (file: File, speakerId: string, eventId?: string) => Promise<UploadResult>;
  uploadOrganizerAvatar: (file: File, organizerId: string) => Promise<UploadResult>;
  deleteEventImage: (path: string) => Promise<UploadResult>;
  deleteProfilePicture: (path: string) => Promise<UploadResult>;
  deleteEventGallery: (paths: string[]) => Promise<UploadResult[]>;
  getEventImageUrl: (path: string) => string;
  getProfilePictureUrl: (path: string) => string;
  getBannerUrl: (path: string) => string;
  getDocumentUrl: (path: string) => string;
  getOptimizedImageUrl: (bucket: string, path: string, options?: { width?: number; height?: number; quality?: number; format?: 'webp' | 'jpeg' | 'png' }) => string;
} = {
  /**
   * Upload event image
   */
  uploadEventImage: async (file: File, eventId?: string): Promise<UploadResult> => {
    const customPath = eventId ? `events/${eventId}/${file.name}` : undefined;
    return uploadFile(file, STORAGE_CONFIGS.EVENT_IMAGES, customPath);
  },

  /**
   * Upload profile picture
   */
  uploadProfilePicture: async (file: File, userId: string): Promise<UploadResult> => {
    const customPath = `profiles/${userId}/${file.name}`;
    return uploadFile(file, STORAGE_CONFIGS.PROFILE_PICTURES, customPath);
  },

  /**
   * Upload banner image
   */
  uploadBanner: async (file: File, customPath?: string): Promise<UploadResult> => {
    return uploadFile(file, STORAGE_CONFIGS.BANNERS, customPath);
  },

  /**
   * Upload document
   */
  uploadDocument: async (file: File, customPath?: string): Promise<UploadResult> => {
    return uploadFile(file, STORAGE_CONFIGS.DOCUMENTS, customPath);
  },

  /**
   * Delete event image
   */
  deleteEventImage: async (path: string): Promise<UploadResult> => {
    return deleteFile(STORAGE_CONFIGS.EVENT_IMAGES.bucket, path);
  },

  /**
   * Delete profile picture
   */
  deleteProfilePicture: async (path: string): Promise<UploadResult> => {
    return deleteFile(STORAGE_CONFIGS.PROFILE_PICTURES.bucket, path);
  },

  /**
   * Get event image URL
   */
  getEventImageUrl: (path: string): string => {
    return getPublicUrl(STORAGE_CONFIGS.EVENT_IMAGES.bucket, path);
  },

  /**
   * Get profile picture URL
   */
  getProfilePictureUrl: (path: string): string => {
    return getPublicUrl(STORAGE_CONFIGS.PROFILE_PICTURES.bucket, path);
  },

  /**
   * Get banner URL
   */
  getBannerUrl: (path: string): string => {
    return getPublicUrl(STORAGE_CONFIGS.BANNERS.bucket, path);
  },

  /**
   * Get document URL
   */
  getDocumentUrl: (path: string): string => {
    return getPublicUrl(STORAGE_CONFIGS.DOCUMENTS.bucket, path);
  },

  /**
   * Upload event gallery
   */
  uploadEventGallery: async (files: File[], eventId: string) => {
    return uploadEventGallery(files, eventId);
  },

  /**
   * Upload speaker image
   */
  uploadSpeakerImage: async (file: File, speakerId: string, eventId?: string) => {
    return uploadSpeakerImage(file, speakerId, eventId);
  },

  /**
   * Upload organizer avatar
   */
  uploadOrganizerAvatar: async (file: File, organizerId: string) => {
    return uploadOrganizerAvatar(file, organizerId);
  },

  /**
   * Delete event gallery images
   */
  deleteEventGallery: async (paths: string[]): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    
    for (const path of paths) {
      const result = await deleteFile(STORAGE_CONFIGS.EVENT_IMAGES.bucket, path);
      results.push(result);
    }
    
    return results;
  },

  /**
   * Get optimized image URL
   */
  getOptimizedImageUrl: (bucket: string, path: string, options?: { width?: number; height?: number; quality?: number; format?: 'webp' | 'jpeg' | 'png' }) => {
    return getOptimizedImageUrl(bucket, path, options);
  }
};

export default storageService;
