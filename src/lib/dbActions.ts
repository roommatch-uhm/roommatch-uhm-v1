'use server';

// Import Prisma client and types
import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Create a new user profile in the database.
 * @param credentials - An object containing the user's email,
 *  password, role, roommate status, budget, firstName, and lastName.
 */
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
      userId: profile.userId,
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

export async function getProfileByUserId(userId: number) {
  return prisma.profile.findUnique({
    where: { userId },
  });
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
  const hashedPassword = await hash(newPassword, 10);
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return updatedUser;
}

/**
 * Delete a user's profile.
 * @param userId - The ID of the user to delete.
 */
export async function deleteUserProfile(userId: number) {
  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  });

  return deletedUser;
}
