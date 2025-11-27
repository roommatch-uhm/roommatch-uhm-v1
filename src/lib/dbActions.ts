'use server';

// Import Prisma client and types
import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';

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

<<<<<<< HEAD
export async function createProfile(
  profile: {
    name: string;
    description: string;
    image?: string | null;
    clean: string;
    budget?: number | null;
    social: string;
    study: string;
    sleep: string;
  },
  userId: number
) {
  // console.log(`createProfile data: ${JSON.stringify(profile, null, 2)}`);
  await prisma.profile.create({
    data: {
      name: profile.name || '',
      description: profile.description || '',
      image: profile.image ?? null,
      clean: profile.clean || '',
      budget: profile.budget ?? null,
      social: profile.social || '',
      study: profile.study || '',
      sleep: profile.sleep || '',
      user: {
        connect: { id: userId },
      },
    },
  });
  // After adding, redirect to the home page
  redirect('/profile');
}

/**
 * Update a user's profile.
 * @param userId - The ID of the user to update.
 * @param updates - An object containing the fields to update (e.g., preferences, roommateStatus).
 */
export async function updateUserProfile(
  userId: number,
  {
    preferences,
    roommateStatus,
    budget,
  }: {
    preferences?: string;
    roommateStatus?: string;
    budget?: number;
  },
) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(preferences !== undefined && { preferences }),
      ...(roommateStatus !== undefined && { roommateStatus }),
      ...(budget !== undefined && { budget }),
    },
  });

  return updatedUser;
}

/**
 * Retrieve a user's profile.
 * @param userId - The ID of the user whose profile is to be fetched.
 */
export async function getUserProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/**
 * Change the password for an existing user profile.
 * @param userId - The ID of the user whose password is to be changed.
 * @param newPassword - The new password to set.
 */
export async function changeUserPassword(userId: number, newPassword: string) {
=======
export async function changeUserPassword(UHemail: string, newPassword: string) {
>>>>>>> 97b59f8063afcc3b46c6aceffea8ffc3a2bcc639
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
