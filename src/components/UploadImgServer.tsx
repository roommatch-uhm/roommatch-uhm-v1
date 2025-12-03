'use client';

import React, { useState } from 'react';

export default function UploadImgServer({ userId, onDone }: { userId: number; onDone?: (data: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('userId', String(userId));
      const res = await fetch('/api/uploadProfileImage', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Upload failed');
      onDone?.(json);
    } catch (err: any) {
      setError(err.message || 'Upload error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <label style={{ display: 'block' }}>
      <input type="file" accept="image/*" onChange={handleFile} />
      {loading && <div style={{ fontSize: 13 }}>Uploading…</div>}
      {error && <div style={{ color: 'red', fontSize: 13 }}>{error}</div>}
    </label>
  );
}