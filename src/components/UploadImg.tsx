'use client';

import { useState, useEffect } from 'react';

const extractFilename = (url?: string | null) => {
  if (!url) return null;
  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    const u = new URL(url, base);
    const name = u.pathname.split('/').pop();
    return name || null;
  } catch {
    if (typeof url === 'string' && url.startsWith('data:')) return 'local-preview';
    const parts = (url || '').split('/');
    return parts[parts.length - 1] || null;
  }
};

const ProfileImageUpload = ({
  onUpload,
  initialUrl,
}: {
  onUpload: (url: string) => void;
  initialUrl?: string | null;
}) => {
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [filename, setFilename] = useState<string | null>(extractFilename(initialUrl) ?? null);
  const [inputId] = useState(() => `profile-image-${Math.random().toString(36).slice(2)}`);
  const [btnHover, setBtnHover] = useState(false);

  useEffect(() => {
    setPreview(initialUrl ?? null);
    setFilename(extractFilename(initialUrl) ?? null);
  }, [initialUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    const uniqueFileName = `${Date.now()}-${file.name}`;
    setFilename(uniqueFileName);

    const formData = new FormData();
    formData.append('file', file, uniqueFileName);

    const res = await fetch('/api/uploadProfileImage', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      alert('Upload failed');
      setFilename(extractFilename(initialUrl) ?? null);
      return;
    }

    const data = await res.json();
    if (data?.url) {
      setPreview(data.url);
      setFilename(extractFilename(data.url) ?? uniqueFileName);
    }
    onUpload(data.url);
  };

  const btnBase: React.CSSProperties = {
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '10px 18px',
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 14,
    minWidth: 150,
    userSelect: 'none',
    border: '1px solid #2563eb',
    background: btnHover ? '#2563eb' : '#ffffff',
    color: btnHover ? '#ffffff' : '#2563eb',
    boxShadow: btnHover ? '0 6px 18px rgba(37,99,235,0.12)' : '0 1px 4px rgba(16,24,40,0.04)',
    transition: 'all 140ms ease',
  };

  return (
    <div>
      {preview && (
        <div style={{ width: '100%', marginBottom: 12, textAlign: 'center' }}>
          <img
            src={preview}
            alt="preview"
            style={{
              width: '100%',
              maxWidth: 420,
              maxHeight: 420,
              objectFit: 'contain',
              borderRadius: 8,
              display: 'inline-block',
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <label
          htmlFor={inputId}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={btnBase}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
            <path d="M12 3v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 21H4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Upload photo
        </label>

        <div
          title={filename ?? undefined}
          style={{
            fontSize: 13,
            color: filename ? '#0f172a' : '#6b7280',
            maxWidth: 420,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            padding: '0 10px',
            textAlign: 'center',
          }}
        >
          {filename ? `Current file: ${filename}` : 'No file chosen'}
        </div>
      </div>
    </div>
  );
};

export default ProfileImageUpload;
