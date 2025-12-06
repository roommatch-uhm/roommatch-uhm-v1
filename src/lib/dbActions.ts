'use server';

import { PrismaClient, Profile, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import { validatePassword } from './passwordValidator';

// Safe global prisma singleton for dev
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}
const prisma: PrismaClient = global.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.__prisma = prisma;

/* ------- Profile helpers (imageData only, no Supabase) ------- */

export async function createProfile(profile: {
  userId: number;
  name: string;
  description?: string | null;
  imageData?: Buffer | null;
  clean: 'excellent' | 'good' | 'fair' | 'poor';
  budget?: number | null;
  social: 'Introvert' | 'Ambivert' | 'Extrovert' | 'Unsure';
  study: 'Cramming' | 'Regular' | 'None';
  sleep: 'Early_Bird' | 'Night_Owl' | 'Flexible';
}) {
  const created = await prisma.profile.create({
    data: {
      user: { connect: { id: profile.userId } },
      name: profile.name,
      description: profile.description ?? '',
      imageAddedAt: profile.imageData ? new Date() : undefined,
      clean: profile.clean,
      budget: profile.budget,
      social: profile.social,
      study: profile.study,
      sleep: profile.sleep,
    },
  });

  return created;
}

export async function editProfile(
  profileId: number,
  updates: {
    name?: string;
    description?: string;
    imageData?: Buffer | null;
    clean?: 'excellent' | 'good' | 'fair' | 'poor';
    budget?: number | null;
    social?: 'Introvert' | 'Ambivert' | 'Extrovert' | 'Unsure';
    study?: 'Cramming' | 'Regular' | 'None';
    sleep?: 'Early_Bird' | 'Night_Owl' | 'Flexible';
  },
) {
  const updateData: any = {
    ...(updates.name !== undefined && { name: updates.name }),
    ...(updates.description !== undefined && { description: updates.description }),
    ...(updates.clean !== undefined && { clean: updates.clean }),
    ...(updates.budget !== undefined && { budget: updates.budget }),
    ...(updates.social !== undefined && { social: updates.social }),
    ...(updates.study !== undefined && { study: updates.study }),
    ...(updates.sleep !== undefined && { sleep: updates.sleep }),
    ...(updates.imageData !== undefined && updates.imageData ? { imageAddedAt: new Date() } : {}),
  };
  const updated = await prisma.profile.update({
    where: { id: profileId },
    data: updateData,
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

/* User helpers remain unchanged */
export async function createUserProfile({
  username,
  UHemail,
  password,
  role,
  roommateStatus,
  budget,
}: {
  username: string;
  UHemail: string;
  password: string;
  role?: Role;
  roommateStatus?: string;
  budget?: number;
}) {
  // Validate password security requirements on server-side
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    throw new Error(
      `Password does not meet security requirements: ${passwordValidation.errors.join(', ')}`,
    );
  }

  // Ensure email unique
  const existingByEmail = await prisma.user.findUnique({ where: { UHemail } });
  if (existingByEmail) {
    throw new Error('Email is already taken');
  }

  // Ensure username unique (only if provided)
  if (username) {
    const existingByUsername = await prisma.user.findUnique({ where: { username } as any });
    if (existingByUsername) {
      throw new Error('Username is already taken');
    }
  }

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      UHemail,
      username,
      password: hashedPassword,
      role: role ?? Role.USER,
      preferences: null,
      roommateStatus: roommateStatus ?? 'Looking',
      budget: budget ?? null,
    },
  });

  return user;
}

export async function changeUserPassword(UHemail: string, newPassword: string) {
  // Validate password security requirements on server-side
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    throw new Error(
      `Password does not meet security requirements: ${passwordValidation.errors.join(', ')}`,
    );
  }

  const hashedPassword = await hash(newPassword, 10);
  return prisma.user.update({
    where: { UHemail },
    data: { password: hashedPassword },
  });
}

export async function updateUserProfile(userId: number, updates: {
  username?: string;
  UHemail?: string;
  password?: string;
  role?: Role;
  roommateStatus?: string;
  budget?: number;
}) {
  const data: any = { ...updates };
  if (updates.password) {
    // Validate password security requirements on server-side
    const passwordValidation = validatePassword(updates.password);
    if (!passwordValidation.isValid) {
      throw new Error(
        `Password does not meet security requirements: ${passwordValidation.errors.join(', ')}`,
      );
    }
    data.password = await hash(updates.password, 10);
  }
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

/* Chat / message helpers remain unchanged */
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
