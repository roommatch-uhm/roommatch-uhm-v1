import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

// runtime must be node for Prisma
export const runtime = 'nodejs';

// Prisma singleton
const prisma: PrismaClient = (globalThis as any).__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') (globalThis as any).__prisma = prisma;

// Read credentials from env (no hardcoded secrets)
const SUPABASE_URL = process.env.STORAGE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.STORAGE_SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_BUCKET = process.env.STORAGE_SUPABASE_BUCKET ?? 'profile-avatars';

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  : null;

export async function POST(req: NextRequest) {
  try {
    if (!supabase) {
      console.error('Supabase client not configured. Missing env vars.');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const contentType = req.headers.get('content-type') ?? '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId')?.toString();

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 });
    }

    const filename = `profiles/${userId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = file.type || 'application/octet-stream';

    const { error: uploadError } = await supabase.storage.from(SUPABASE_BUCKET).upload(filename, buffer, {
      contentType: mime,
      upsert: false,
    });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: 'Supabase upload failed', detail: uploadError }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(filename);
    const publicUrl = publicUrlData?.publicUrl ?? null;

    let updated;
    try {
      updated = await prisma.profile.update({
        where: { userId: Number(userId) },
        data: { imageKey: filename, imageUrl: publicUrl, imageSource: 'supabase', imageAddedAt: new Date() },
      });
    } catch (dbErr: any) {
      console.error('Prisma update error:', dbErr);
      return NextResponse.json({ error: 'Profile not found for userId' }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: updated, url: publicUrl }, { status: 200 });
  } catch (err: any) {
    console.error('uploadProfileImage route unexpected error:', err);
    return NextResponse.json({ error: 'Server error', detail: err?.message ?? String(err) }, { status: 500 });
  }
}
