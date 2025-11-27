'use client';

import { useState } from 'react';

const ProfileImageUpload = ({
  onUpload,
  initialUrl,
}: {
  onUpload: (url: string) => void;
  initialUrl?: string | null;
}) => {
  // use the provided initialUrl as the initial preview (profile image or default)
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Generate unique filename
    const uniqueFileName = `${Date.now()}-${file.name}`;

    // Prepare FormData to send to your backend
    const formData = new FormData();
    formData.append('file', file, uniqueFileName);

    // POST to your upload endpoint
    const res = await fetch('/api/uploadProfileImage', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      alert('Upload failed');
      return;
    }

    const data = await res.json();
    // update preview to the uploaded URL (so preview becomes canonical)
    if (data?.url) setPreview(data.url);
    onUpload(data.url); // Save the URL in the form
  };

  return (
    <div>
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
      <input type="file" accept="image/*" onChange={handleFileChange} />
    </div>
  );
};

export default ProfileImageUpload;
