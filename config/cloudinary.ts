import axios from 'axios';

const CLOUD_NAME = 'dd4fdmtmj';
const UPLOAD_PRESET = 'user_uploads';

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  original_filename: string;
}

export const uploadToCloudinary = async (file: File | string, resourceType: 'image' | 'raw'): Promise<CloudinaryResponse> => {
  try {
    let uploadFile: File;

    // Handle blob URLs
    if (typeof file === 'string' && file.startsWith('blob:')) {
      const response = await fetch(file);
      const blob = await response.blob();
      uploadFile = new File([blob], 'image.jpg', { type: blob.type });
    } else if (file instanceof File) {
      uploadFile = file;
    } else {
      throw new Error('Invalid file input');
    }

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', CLOUD_NAME);

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;
    
    // Log upload attempt
    console.log('Attempting Cloudinary upload:', {
      url,
      fileName: uploadFile.name,
      fileType: uploadFile.type,
      fileSize: uploadFile.size,
      uploadPreset: UPLOAD_PRESET,
      cloudName: CLOUD_NAME
    });

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cloudinary API error:', {
        status: response.status,
        statusText: response.statusText,
        errorDetails: data
      });
      throw new Error(data.error?.message || `Upload failed with status ${response.status}`);
    }

    // Log successful upload
    console.log('Cloudinary upload successful:', {
      publicId: data.public_id,
      url: data.secure_url,
      format: data.format
    });

    return {
      secure_url: data.secure_url,
      public_id: data.public_id,
      resource_type: data.resource_type,
      format: data.format,
      original_filename: data.original_filename
    };

  } catch (error: any) {
    console.error('Cloudinary upload error details:', {
      message: error.message,
      response: error.response?.data,
      fileInfo: typeof file === 'string' ? { url: file } : {
        name: file.name,
        type: file.type,
        size: file.size
      }
    });
    
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

// Helper function to get viewable URL
export const getViewableUrl = (secureUrl: string, resourceType: 'image' | 'raw'): string => {
  if (resourceType === 'raw') {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(secureUrl)}`;
  }
  return secureUrl;
};