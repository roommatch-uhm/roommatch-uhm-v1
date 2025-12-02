'use server';

// Import Prisma client and types
import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import { validatePassword } from './passwordValidator';

const prisma = new PrismaClient();

export type CreateProfileInput = {
  userId: number;
  name: string;
  description: string;
  image: string | null;
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
      description: profile.description,
      image: profile.image ?? null,
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
    image?: string | null;
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
      ...(updates.image !== undefined && { image: updates.image }),
      ...(updates.clean !== undefined && { clean: updates.clean }),
      ...(updates.budget !== undefined && { budget: updates.budget }),
      ...(updates.social !== undefined && { social: updates.social }),
      ...(updates.study !== undefined && { study: updates.study }),
      ...(updates.sleep !== undefined && { sleep: updates.sleep }),
    },
  });

  return updated;
}

export async function getProfileByUserId(userId: number) {
  return prisma.profile.findUnique({
    where: { userId },
  });
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
  // Validate password security requirements on server-side
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    throw new Error(
      `Password does not meet security requirements: ${passwordValidation.errors.join(', ')}`,
    );
  }

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { UHemail },
  });

  if (existingUser) {
    throw new Error('Email is already taken');
  }

  // Hash the password before storing it
  const hashedPassword = await hash(password, 10);

  // Create a new user profile
  const user = await prisma.user.create({
    data: {
      UHemail,
      password: hashedPassword,
      role: role || Role.USER,
      roommateStatus: roommateStatus || 'Looking',
      budget, // Ensure budget is included
      firstName, // Add firstName
      lastName, // Add lastName
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

// Create a new chat between two users
export async function createChat(userId1: number, userId2: number) {
  const user1 = await prisma.user.findUnique({ where: { id: userId1 } });
  const user2 = await prisma.user.findUnique({ where: { id: userId2 } });
  if (!user1 || !user2) {
    throw new Error('One or both users not found');
  }

  // Check if a chat already exists between these two users
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
    return existingChat; // Do not create duplicate chat
  }

  // Create new chat
  return prisma.chat.create({
    data: {
      members: {
        connect: [{ id: userId1 }, { id: userId2 }],
      },
    },
    include: { members: true },
  });
}

// Send a message in a chat
export async function sendMessage(chatId: number, senderId: number, content: string) {
  // Check if sender is a member of the chat
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

// Get all messages for a chat (authorization)
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
