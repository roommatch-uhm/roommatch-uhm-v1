'use client';

import { useState } from 'react';

const ProfileImageUpload = ({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Generate unique filename
    const uniqueFileName = `${Date.now()}-${file.name}`;

    // Prepare FormData to send to your backend
    const formData = new FormData();
    formData.append('file', file, uniqueFileName);

    // POST to your Vercel Blob endpoint
    const res = await fetch('/api/uploadProfileImage', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      alert('Upload failed');
      return;
    }

    const data = await res.json();
    onUpload(data.url); // Save the URL in the form
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{ maxWidth: '150px', marginTop: '10px' }}
        />
      )}
    </div>
  );
};

export default ProfileImageUpload;
