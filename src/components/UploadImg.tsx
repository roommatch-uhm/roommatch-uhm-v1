'use client';

import { useState } from 'react';
import { MAX_PROFILE_IMAGE_SIZE, ALLOWED_IMAGE_TYPES } from '@/lib/validationSchemas';
import { Alert } from 'react-bootstrap';

const ProfileImageUpload = ({
  onUpload,
  initialUrl,
}: {
  onUpload: (url: string) => void;
  initialUrl?: string | null;
}) => {
  // use the provided initialUrl as the initial preview (profile image or default)
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setError(null);

    // Client-side validation: Check file size
    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      const maxSizeMB = MAX_PROFILE_IMAGE_SIZE / (1024 * 1024);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setError(
        `File is too large. Maximum size is ${maxSizeMB}MB, but your file is ${fileSizeMB}MB. Please choose a smaller image.`,
      );
      // Reset the input
      e.target.value = '';
      return;
    }

    // Client-side validation: Check file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(
        `Invalid file type. Please upload an image file (JPEG, PNG, WebP, or GIF). You selected: ${file.type}`,
      );
      // Reset the input
      e.target.value = '';
      return;
    }

    // Client-side validation: Check file is not empty
    if (file.size === 0) {
      setError('The selected file is empty. Please choose a valid image.');
      e.target.value = '';
      return;
    }

    setUploading(true);

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Generate unique filename
    const uniqueFileName = `${Date.now()}-${file.name}`;

    // Prepare FormData to send to your backend
    const formData = new FormData();
    formData.append('file', file, uniqueFileName);

    try {
      // POST to your upload endpoint
      const res = await fetch('/api/uploadProfileImage', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        // Server returned an error
        setError(data.error || 'Upload failed. Please try again.');
        // Reset preview on error
        setPreview(initialUrl ?? null);
        // Reset the input
        e.target.value = '';
        return;
      }

      // update preview to the uploaded URL (so preview becomes canonical)
      if (data?.url) setPreview(data.url);
      onUpload(data.url); // Save the URL in the form
    } catch (err) {
      console.error('Upload error:', err);
      setError('Network error. Please check your connection and try again.');
      // Reset preview on error
      setPreview(initialUrl ?? null);
      // Reset the input
      e.target.value = '';
    } finally {
      setUploading(false);
    }
  };

  const maxSizeMB = MAX_PROFILE_IMAGE_SIZE / (1024 * 1024);

  return (
    <div>
      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <strong>Upload Error:</strong> {error}
        </Alert>
      )}

      {/* File size information */}
      <div className="mb-2 text-muted small">
        Maximum file size: {maxSizeMB}MB | Allowed formats: JPEG, PNG, WebP, GIF
      </div>

      {/* Larger preview above the file input */}
      {preview && (
        <div style={{ width: '100%', marginBottom: '12px', textAlign: 'center' }}>
          <img
            src={preview}
            alt="preview"
            style={{
              width: '100%',
              maxWidth: '420px',
              maxHeight: '420px',
              objectFit: 'contain',
              borderRadius: 8,
              display: 'inline-block',
            }}
          />
        </div>
      )}

      {/* File input with loading state */}
      <div>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          disabled={uploading}
          className="form-control"
        />
        {uploading && (
          <div className="mt-2 text-primary small">
            <span className="spinner-border spinner-border-sm me-2" />
            Uploading image...
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUpload;
