'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useSession } from 'next-auth/react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * UploadImgClient
 * - uploads directly from browser to Supabase Storage (recommended)
 * - then calls your server endpoint to persist the storage key / url in Prisma
 */
export default function UploadImgClient({
  userId: propUserId,
  bucket = 'profile-avatars',
  onDone,
}: {
  userId?: number | string;
  bucket?: string;
  onDone?: (data: any) => void;
}) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure env present
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    return (
      <div style={{ color: '#b91c1c', fontSize: 13 }}>
        Upload unavailable — missing NEXT_PUBLIC_SUPABASE env vars.
      </div>
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

  const resolveUserId = () => {
    if (propUserId) return propUserId;
    // try next-auth session (may be string id)
    // caller should prefer passing numeric userId
    return (session as any)?.user?.id ?? null;
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);

    const userId = resolveUserId();
    if (!userId) {
      setError('Unable to determine user ID. Please sign in or pass userId prop.');
      setLoading(false);
      return;
    }

    try {
      const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
      const key = `profiles/${userId}/${Date.now()}_${safeName}`;

      // upload directly (browser File supported)
      const { error: uploadError } = await supabase.storage.from(bucket).upload(key, file, { upsert: false });
      if (uploadError) throw uploadError;

      // get public URL for public bucket; if your bucket is private, request signed URL from server when displaying
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(key);
      const publicUrl = urlData?.publicUrl ?? null;

      // persist key/url in your DB via server endpoint
      const res = await fetch('/api/saveProfileImageKey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          key,
          url: publicUrl,
          source: 'supabase',
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to persist image key');

      onDone?.({ key, url: publicUrl, api: json });
    } catch (err: any) {
      console.error('UploadImgClient error', err);
      setError(err?.message ?? 'Upload failed');
    } finally {
      setLoading(false);
      // reset input value so same file can be reselected
      if (e.target) e.target.value = '';
    }
  };

  return (
    <label style={{ display: 'block' }}>
      <input type="file" accept="image/*" onChange={handleFile} />
      {loading && <div style={{ fontSize: 13, color: '#374151' }}>Uploading…</div>}
      {error && <div style={{ color: '#dc2626', fontSize: 13 }}>{error}</div>}
    </label>
  );
}