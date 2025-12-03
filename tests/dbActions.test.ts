import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import {
  createUserProfile,
  updateUserProfile,
  changeUserPassword,
  createProfile,
  editProfile,
  getProfileByUserId,
  getProfileById,
  createChat,
  sendMessage,
  getChatMessages,
} from '../src/lib/dbActions';

jest.setTimeout(30000); // 30 seconds

const prisma = new PrismaClient();
let userId: number;
let profileId: number;

// Local helper to fetch a user profile using Prisma when dbActions does not export getUserProfile
const getUserProfileLocal = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');
  return user;
};

const defaultAccounts = [
  {
    UHemail: 'admin@foo.com',
    password: 'changeme1',
    role: Role.ADMIN,
    preferences: 'Prefers a clean, quiet environment. Non-smoker.',
    roommateStatus: 'Looking',
    budget: 1000.00,
  },
  {
    UHemail: 'john@foo.com',
    password: 'changeme2',
    role: Role.USER,
    preferences: 'Looking for a roommate who enjoys social activities and is easy-going.',
    roommateStatus: 'Looking',
    budget: 800.00,
  },
];

describe('User Profile & Profile Tests', () => {
  beforeAll(async () => {
    // Clean up only the test user/profile from previous runs
    const testUser = await prisma.user.findUnique({ where: { UHemail: 'testuser@example.com' } });
    if (testUser) {
      await prisma.profile.deleteMany({ where: { userId: testUser.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
    }

    // Create the test user and profile for this test run
    const user = await createUserProfile({
      UHemail: 'testuser@example.com',
      password: 'testpassword123',
      role: Role.USER,
      roommateStatus: 'Looking',
      budget: 1500.00,
    });
    userId = user.id;

    const profile = await createProfile({
      userId,
      name: 'Test Profile',
      description: 'A test profile',
      image: null,
      clean: 'excellent',
      budget: 1500,
      social: 'Introvert',
      study: 'Regular',
      sleep: 'Early_Bird',
    });
    profileId = profile.id;

    // Insert default accounts (if needed for your tests)
    await Promise.all(defaultAccounts.map(async (account) => {
      const hashedPassword = await hash(account.password, 10);
      await prisma.user.create({
        data: {
          UHemail: account.UHemail,
          password: hashedPassword,
          role: account.role,
          preferences: account.preferences,
          roommateStatus: account.roommateStatus,
          budget: account.budget,
        },
      });
    }));
  });

  afterAll(async () => {
    // Only delete the test user and profile you created
    if (profileId) await prisma.profile.delete({ where: { id: profileId } });
    if (userId) await prisma.user.delete({ where: { id: userId } });
    // Optionally delete default accounts if you created them
    await prisma.user.deleteMany({
      where: { UHemail: { in: defaultAccounts.map(acc => acc.UHemail) } },
    });
    await prisma.$disconnect();
  });

  it('should create a user profile with a budget', async () => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user).toBeDefined();
    expect(user?.UHemail).toBe('testuser@example.com');
    expect(user?.budget).toBe(1500.00);
  });

  it('should update a user profile with a new budget', async () => {
    const updatedUser = await updateUserProfile(userId, {
      preferences: 'Non-smoking',
      roommateStatus: 'Has Roommate',
      budget: 1800.00,
    } as any);
    expect(updatedUser.preferences).toBe('Non-smoking');
    expect(updatedUser.roommateStatus).toBe('Has Roommate');
    expect(updatedUser.budget).toBe(1800.00);
  });

  it('should fetch a user profile', async () => {
    const userProfile = await getUserProfileLocal(userId);
    expect(userProfile).toBeDefined();
    expect(userProfile.UHemail).toBe('testuser@example.com');
  });

  it('should change the user password', async () => {
    await changeUserPassword('testuser@example.com', 'newpassword123');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user?.password).not.toBe('testpassword123');
  });

  it('should create and edit a profile', async () => {
    const edited = await editProfile(profileId, {
      name: 'Updated Profile',
      budget: 2000,
      clean: 'good',
    });
    expect(edited.name).toBe('Updated Profile');
    expect(edited.budget).toBe(2000);
    expect(edited.clean).toBe('good');
  });

  it('should fetch profile by userId', async () => {
    const profile = await getProfileByUserId(userId);
    expect(profile).toBeDefined();
    expect(profile?.name).toBe('Updated Profile');
  });

  it('should fetch profile by profileId', async () => {
    const profile = await getProfileById(profileId);
    expect(profile).toBeDefined();
    expect(profile?.name).toBe('Updated Profile');
  });

  it('should not allow duplicate UHemail registration', async () => {
    await expect(
      createUserProfile({
        UHemail: 'testuser@example.com',
        password: 'anotherpassword',
        role: Role.USER,
        roommateStatus: 'Looking',
        budget: 1200.00,
      }),
    ).rejects.toThrow('Email is already taken');
  });

  it('should throw error when fetching non-existent user', async () => {
    await expect(getUserProfileLocal(999999)).rejects.toThrow('User not found');
  });

  it('should create a chat and send a message', async () => {
    // Clean up any leftover test messages, chats, and users from previous runs
    await prisma.message.deleteMany({
      where: {
        sender: {
          UHemail: { in: ['userA@example.com', 'userB@example.com'] },
        },
      },
    });
    await prisma.chat.deleteMany({
      where: {
        members: {
          some: {
            UHemail: { in: ['userA@example.com', 'userB@example.com'] },
          },
        },
      },
    });
    await prisma.user.deleteMany({
      where: { UHemail: { in: ['userA@example.com', 'userB@example.com'] } },
    });

    // Create two users
    const userA = await createUserProfile({
      UHemail: 'userA@example.com',
      password: 'passA',
      role: Role.USER,
      roommateStatus: 'Looking',
      budget: 1000,
    });
    const userB = await createUserProfile({
      UHemail: 'userB@example.com',
      password: 'passB',
      role: Role.USER,
      roommateStatus: 'Looking',
      budget: 1000,
    });

    // Create chat
    const chat = await createChat(userA.id, userB.id);
    expect(chat.members.length).toBe(2);

    // Send message
    const message = await sendMessage(chat.id, userA.id, 'Hello!');
    expect(message.content).toBe('Hello!');

    // Get messages
    const messages = await getChatMessages(chat.id, userA.id);
    expect(messages.length).toBeGreaterThan(0);

    // Cleanup: only delete the chat and messages for these test users
    try {
      await prisma.message.deleteMany({ where: { chatId: chat.id } });
      await prisma.chat.delete({ where: { id: chat.id } });
      await prisma.user.delete({ where: { id: userA.id } });
      await prisma.user.delete({ where: { id: userB.id } });
    } catch (err) {
      // Ignore errors if already deleted
    }
  });
});
