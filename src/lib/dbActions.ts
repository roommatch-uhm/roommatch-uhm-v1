'use server';

import { PrismaClient, Profile, Role } from '@prisma/client';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { hash } from 'bcrypt';

// safe global prisma singleton for dev
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}
const prisma: PrismaClient = global.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.__prisma = prisma;

// Supabase server client (service role) for uploads / signed URLs
const SUPABASE_URL = process.env.STORAGE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.STORAGE_SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_BUCKET = process.env.STORAGE_SUPABASE_BUCKET || 'profile-avatars';

let supabase: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}

/**
 * Uploads a file buffer to Supabase Storage and updates the profile row with the key + public URL.
 * Returns the updated Profile.
 */
export async function uploadAndAttachProfileImage(
  userId: number,
  fileBuffer: Buffer,
  originalName: string,
  contentType?: string,
) : Promise<Profile> {
  if (!supabase) throw new Error('Supabase service client not configured (missing env vars).');

  const filename = `profiles/${userId}/${Date.now()}_${originalName.replace(/\s+/g, '_')}`;

  const { error: uploadError } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(filename, fileBuffer, { contentType: contentType ?? 'application/octet-stream', upsert: false });

  if (uploadError) {
    // bubble up a helpful error
    throw new Error(`Supabase upload failed: ${uploadError.message}`);
  }

  // If bucket is public this returns a public URL. For private buckets you can create signed URLs below.
  const { data: publicUrlData } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(filename);
  const publicUrl = publicUrlData?.publicUrl ?? null;

  const updated = await prisma.profile.update({
    where: { userId },
    data: {
      imageKey: filename,
      imageUrl: publicUrl,
      imageSource: 'supabase',
      imageAddedAt: new Date(),
    },
  });

  return updated;
}

/**
 * Create a short-lived signed URL for a given profile's stored imageKey.
 * Returns signed url string or null.
 */
export async function createSignedProfileImageUrl(profile: Profile, expiresInSeconds = 60): Promise<string | null> {
  if (!supabase) throw new Error('Supabase service client not configured (missing env vars).');
  const key = profile.imageKey ?? '';
  if (!key) return profile.imageUrl ?? null;

  // createSignedUrl returns data.signedUrl
  const { data, error } = await supabase.storage.from(SUPABASE_BUCKET).createSignedUrl(key, expiresInSeconds);
  if (error) {
    console.warn('createSignedProfileImageUrl error', error);
    return profile.imageUrl ?? null;
  }
  return data?.signedUrl ?? profile.imageUrl ?? null;
}

/* ------- existing profile helpers (updated to prefer new image fields) ------- */

export type CreateProfileInput = {
  userId: number;
  name: string;
  description?: string | null;
  // imageUrl / imageKey preferred over legacy `image`
  imageUrl?: string | null;
  imageKey?: string | null;
  clean: 'excellent' | 'good' | 'fair' | 'poor';
  budget: number;
  social: 'Introvert' | 'Ambivert' | 'Extrovert' | 'Unsure';
  study: 'Cramming' | 'Regular' | 'None';
  sleep: 'Early_Bird' | 'Night_Owl' | 'Flexible';
};

export async function createProfile(profile: CreateProfileInput) {
  const created = await prisma.profile.create({
    data: {
      user: { connect: { id: profile.userId } },
      name: profile.name,
      description: profile.description ?? '',
      imageUrl: profile.imageUrl ?? null,
      imageKey: profile.imageKey ?? null,
      clean: profile.clean,
      budget: profile.budget,
      social: profile.social,
      study: profile.study,
      sleep: profile.sleep,
      imageAddedAt: profile.imageUrl ? new Date() : undefined,
    },
  });

  return created;
}

export async function editProfile(
  profileId: number,
  updates: {
    name?: string;
    description?: string;
    imageUrl?: string | null;
    imageKey?: string | null;
    clean?: 'excellent' | 'good' | 'fair' | 'poor';
    budget?: number | null;
    social?: 'Introvert' | 'Ambivert' | 'Extrovert' | 'Unsure';
    study?: 'Cramming' | 'Regular' | 'None';
    sleep?: 'Early_Bird' | 'Night_Owl' | 'Flexible';
  },
) {
  const updated = await prisma.profile.update({
    where: { id: profileId },
    data: {
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.imageUrl !== undefined && { imageUrl: updates.imageUrl }),
      ...(updates.imageKey !== undefined && { imageKey: updates.imageKey }),
      ...(updates.clean !== undefined && { clean: updates.clean }),
      ...(updates.budget !== undefined && { budget: updates.budget }),
      ...(updates.social !== undefined && { social: updates.social }),
      ...(updates.study !== undefined && { study: updates.study }),
      ...(updates.sleep !== undefined && { sleep: updates.sleep }),
      ...(updates.imageUrl !== undefined && updates.imageUrl ? { imageAddedAt: new Date() } : {}),
    },
  });

  return updated;
}

export async function getProfileByUserId(userId: number): Promise<Profile | null> {
  return prisma.profile.findUnique({ where: { userId } });
}

export async function getProfileById(profileId: number) {
  return prisma.profile.findUnique({
    where: { id: profileId },
  });
}

/* Optional: user creation helper (kept from your earlier code) */
export async function createUserProfile({
  UHemail,
  password,
  role,
  roommateStatus,
  budget,
  firstName,
  lastName,
}: {
  UHemail: string;
  password: string;
  role?: Role;
  roommateStatus?: string;
  budget: number;
  firstName: string;
  lastName: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { UHemail },
  });

  if (existingUser) {
    throw new Error('Email is already taken');
  }

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      UHemail,
      password: hashedPassword,
      role: role || Role.USER,
      roommateStatus: roommateStatus || 'Looking',
      budget,
      firstName,
      lastName,
    },
  });

  return user;
}

export async function changeUserPassword(UHemail: string, newPassword: string) {
  const hashedPassword = await hash(newPassword, 10);
  return prisma.user.update({
    where: { UHemail },
    data: { password: hashedPassword },
  });
}

export async function updateUserProfile(userId: number, updates: {
  firstName?: string;
  lastName?: string;
  UHemail?: string;
  password?: string;
  role?: Role;
  roommateStatus?: string;
  budget?: number;
}) {
  const data: any = { ...updates };
  if (updates.password) {
    data.password = await hash(updates.password, 10);
  }
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

/* Chat / message helpers remain unchanged - ensure your schema has Chat/Message models */
export async function createChat(userId1: number, userId2: number) {
  const user1 = await prisma.user.findUnique({ where: { id: userId1 } });
  const user2 = await prisma.user.findUnique({ where: { id: userId2 } });
  if (!user1 || !user2) {
    throw new Error('One or both users not found');
  }

  const existingChat = await prisma.chat.findFirst({
    where: {
      AND: [
        { members: { some: { id: userId1 } } },
        { members: { some: { id: userId2 } } },
      ],
    },
    include: { members: true },
  });

  if (existingChat) {
    return existingChat;
  }

  return prisma.chat.create({
    data: {
      members: {
        connect: [{ id: userId1 }, { id: userId2 }],
      },
    },
    include: { members: true },
  });
}

export async function sendMessage(chatId: number, senderId: number, content: string) {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { members: true },
  });
  if (!chat || !chat.members.some(u => u.id === senderId)) {
    throw new Error('Not authorized');
  }
  return prisma.message.create({
    data: { chatId, senderId, content },
  });
}

export async function getChatMessages(chatId: number, userId: number) {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { members: true },
  });
  if (!chat || !chat.members.some(u => u.id === userId)) {
    throw new Error('Not authorized');
  }
  return prisma.message.findMany({
    where: { chatId },
    orderBy: { timestamp: 'asc' },
  });
}
