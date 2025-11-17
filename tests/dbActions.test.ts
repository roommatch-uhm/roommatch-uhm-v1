import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import { createUserProfile, updateUserProfile, getUserProfile, changeUserPassword } from '../src/lib/dbActions';

const prisma = new PrismaClient();
let userId: number; // This will store the test user ID

// Default accounts JSON with firstName and lastName added
const defaultAccounts = [
  {
    id: 1,
    firstName: 'Admin',
    lastName: 'User',
    UHemail: 'admin@foo.com',
    password: 'changeme1',
    role: Role.ADMIN,
    preferences: 'Prefers a clean, quiet environment. Non-smoker.',
    roommateStatus: 'Looking',
    budget: 1000.00,
  },
  {
    id: 2,
    firstName: 'John',
    lastName: 'Doe',
    UHemail: 'john@foo.com',
    password: 'changeme2',
    role: Role.USER,
    preferences: 'Looking for a roommate who enjoys social activities and is easy-going.',
    roommateStatus: 'Looking',
    budget: 800.00,
  },
  {
    id: 3,
    firstName: 'Jane',
    lastName: 'Smith',
    UHemail: 'jane@foo.com',
    password: 'changeme3',
    role: Role.USER,
    preferences: 'Prefers a calm living space. Likes quiet nights and good communication.',
    roommateStatus: 'Has Roommate',
    budget: 900.00,
  },
];

describe('User Profile Tests', () => {
  beforeAll(async () => {
    // Clean up all users before running tests
    await prisma.user.deleteMany({});

    // Create a test user
    const user = await createUserProfile({
      UHemail: 'testuser@example.com',
      password: 'testpassword123',
      role: Role.USER,
      roommateStatus: 'Looking',
      budget: 1500.00,
      firstName: 'Test',
      lastName: 'User',
    });
    userId = user.id; // Store the user ID for later tests

    // Insert default accounts
    await Promise.all(defaultAccounts.map(async (account) => {
      const hashedPassword = await hash(account.password, 10);
      await prisma.user.create({
        data: {
          firstName: account.firstName,
          lastName: account.lastName,
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
    // Delete the test user created in beforeAll
    if (userId) {
      await prisma.user.delete({ where: { id: userId } });
    }

    // Optional: Clean up default accounts after tests
    await prisma.user.deleteMany({
      where: {
        UHemail: { in: defaultAccounts.map(acc => acc.UHemail) },
      },
    });

    await prisma.$disconnect();
  });

  it('should create a user profile with a budget', async () => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user).toBeDefined();
    expect(user?.UHemail).toBe('testuser@example.com');
    expect(user?.budget).toBe(1500.00);
    expect(user?.firstName).toBe('Test');
    expect(user?.lastName).toBe('User');
  });

  it('should update a user profile with a new budget', async () => {
    const updatedUser = await updateUserProfile(userId, {
      preferences: 'Non-smoking',
      roommateStatus: 'Has Roommate',
      budget: 1800.00,
    });
    expect(updatedUser.preferences).toBe('Non-smoking');
    expect(updatedUser.roommateStatus).toBe('Has Roommate');
    expect(updatedUser.budget).toBe(1800.00);
  });

  it('should fetch a user profile', async () => {
    const userProfile = await getUserProfile(userId);
    expect(userProfile).toBeDefined();
    expect(userProfile.UHemail).toBe('testuser@example.com');
    expect(userProfile.firstName).toBe('Test');
    expect(userProfile.lastName).toBe('User');
  });

  it('should change the user password', async () => {
    await changeUserPassword(userId, 'newpassword123');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user?.password).not.toBe('testpassword123');
  });

  it('should fetch and print all default accounts', async () => {
    const users = await prisma.user.findMany({
      where: { UHemail: { in: defaultAccounts.map(acc => acc.UHemail) } },
    });

    console.log('Default Accounts in DB:');
    users.forEach(user => {
      console.log(`${user.firstName} ${user.lastName} (${user.UHemail}) - Budget: ${user.budget}`);
    });

    expect(users.length).toBe(defaultAccounts.length);
    users.forEach(user => {
      expect(user).toHaveProperty('firstName');
      expect(user).toHaveProperty('lastName');
      expect(user).toHaveProperty('UHemail');
      expect(user).toHaveProperty('preferences');
      expect(user).toHaveProperty('roommateStatus');
      expect(user).toHaveProperty('budget');
    });
  });

  it('should not allow duplicate UHemail registration', async () => {
    await expect(
      createUserProfile({
        UHemail: 'testuser@example.com',
        password: 'anotherpassword',
        role: Role.USER,
        roommateStatus: 'Looking',
        budget: 1200.00,
        firstName: 'Duplicate',
        lastName: 'User',
      }),
    ).rejects.toThrow('Email is already taken');
  });

  it('should throw error when fetching non-existent user', async () => {
    await expect(getUserProfile(999999)).rejects.toThrow('User not found');
  });

  it('should update only specific fields', async () => {
    const updatedUser = await updateUserProfile(userId, {
      roommateStatus: 'Looking for Roommate',
    });
    expect(updatedUser.roommateStatus).toBe('Looking for Roommate');
  });

  it('should not update user if no fields are provided', async () => {
    const userBefore = await prisma.user.findUnique({ where: { id: userId } });
    const updatedUser = await updateUserProfile(userId, {});
    expect(updatedUser).toMatchObject(userBefore as object);
  });

  // Additional tests

  it('should delete a user profile and ensure it is removed', async () => {
    // Create a new user to delete
    const tempUser = await createUserProfile({
      UHemail: 'tempuser@example.com',
      password: 'temppassword',
      role: Role.USER,
      roommateStatus: 'Looking',
      budget: 500.00,
      firstName: 'Temp',
      lastName: 'User',
    });
    const deletedUser = await prisma.user.delete({ where: { id: tempUser.id } });
    expect(deletedUser.UHemail).toBe('tempuser@example.com');
    const shouldBeNull = await prisma.user.findUnique({ where: { id: tempUser.id } });
    expect(shouldBeNull).toBeNull();
  });

  it('should update multiple fields at once', async () => {
    const updatedUser = await updateUserProfile(userId, {
      preferences: 'Likes pets',
      roommateStatus: 'Not Looking',
      budget: 2000.00,
    });
    expect(updatedUser.preferences).toBe('Likes pets');
    expect(updatedUser.roommateStatus).toBe('Not Looking');
    expect(updatedUser.budget).toBe(2000.00);
  });

  it('should not find a user by a non-existent UHemail', async () => {
    const user = await prisma.user.findUnique({ where: { UHemail: 'doesnotexist@foo.com' } });
    expect(user).toBeNull();
  });

  it('should ensure all default accounts have unique UHemail', async () => {
    const emails = defaultAccounts.map(acc => acc.UHemail);
    const uniqueEmails = new Set(emails);
    expect(uniqueEmails.size).toBe(emails.length);
  });

  it('should ensure all default accounts have a positive budget', async () => {
    defaultAccounts.forEach(acc => {
      expect(acc.budget).toBeGreaterThan(0);
    });
  });

  it('should print all accounts in the database', async () => {
    const users = await prisma.user.findMany();
    console.log('All Accounts in DB:');
    users.forEach(user => {
      console.log(
        `${user.firstName} ${user.lastName} (${user.UHemail}) - Role: ${user.role} - Budget: ${user.budget} - Status: 
        ${user.roommateStatus} - Preferences: ${user.preferences}`,
      );
    });
    expect(Array.isArray(users)).toBe(true);
  });
});
