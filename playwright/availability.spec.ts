import { test, expect } from '@playwright/test';

let testUserId: number;
let testProfileId: number;
let testUserEmail: string;
let testUserPassword = 'testpassword';

test.beforeAll(async ({ request }) => {
  // Use a unique email for each test run to avoid conflicts
  testUserEmail = `testuser+${Date.now()}@hawaii.edu`;
  const userRes = await request.post('/api/users', {
    data: {
      UHemail: testUserEmail,
      password: testUserPassword,
      role: 'USER',
      roommateStatus: 'Looking',
      budget: 999.99,
    },
  });

  if (!userRes.ok()) {
    throw new Error(`Failed to create test user: ${userRes.status()} ${await userRes.text()}`);
  }
  const user = await userRes.json();
  testUserId = user.id;

  // Create a test profile for that user
  const profileRes = await request.post('/api/profiles', {
    data: {
      userId: testUserId,
      image: '/uploads/default.jpg',
      name: 'Test Profile',
      description: 'Test description',
      clean: 'Clean',
      budget: 999.99,
      social: 'Social',
      study: 'Regular',
      sleep: 'Early Bird',
    },
  });

  if (!profileRes.ok()) {
    throw new Error(`Failed to create test profile: ${profileRes.status()} ${await profileRes.text()}`);
  }
  const profile = await profileRes.json();
  testProfileId = profile.id;
});

test.afterAll(async ({ request }) => {
  // Find all test users by email pattern
  const usersRes = await request.get('/api/users?emailPattern=testuser');
  const users = await usersRes.json();

  for (const user of users) {
    // Delete associated profile(s) if needed
    await request.delete(`/api/profiles/by-user/${user.id}`);
    // Delete user
    await request.delete(`/api/users/${user.id}`);
  }
});

// Home page availability
test('Home page is available', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
});

// Matches list page availability
test('Matches list page displays profiles', async ({ page }) => {
  await page.goto('/list');
  await expect(page.getByText(/Test Profile/)).toBeVisible();
});

// Profile detail page availability
test('Profile detail page displays info', async ({ page }) => {
  await page.goto(`/matches/${testProfileId}`);
  await expect(page.getByText(/Test Profile/)).toBeVisible();
  await expect(page.getByText(/budget/i)).toBeVisible();
  // await expect(page.getByRole('img')).toBeVisible();
});

// Edit profile form operates with legal inputs
test('Edit Profile form operates with legal inputs', async ({ page }) => {
  await page.goto(`/edit/${testProfileId}`);
  await page.fill('input[name="name"]', 'Robert');
  await page.fill('input[name="budget"]', '1200');
  await page.click('button[type="submit"]');
  await expect(page.getByText(/profile updated/i)).toBeVisible();
});

// Messages page availability and form
test('Messages page is available and form works', async ({ page }) => {
  await page.goto('/messages?chatId=1');
  await expect(page.getByText(/messages/i)).toBeVisible();
  await page.fill('input[type="text"]', 'Hello!');
  await page.click('button[type="submit"]');
  // Optionally check for message sent confirmation or new message in chat
});

// Login page form (if applicable)
test('Login form operates with legal inputs', async ({ page }) => {
  await page.goto('/auth/signin');
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await page.fill('input[name="email"]', testUserEmail);
  await page.fill('input[name="password"]', testUserPassword);
  await page.click('button[type="submit"]');
  // Expect a welcome message or dashboard heading after successful login
  await expect(page.getByText(/welcome|dashboard|home/i)).toBeVisible();
});

// Calendar page availability
test('Meetings page (calendar) is available', async ({ page }) => {
  await page.goto('/auth/signin');
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await page.fill('input[name="email"]', testUserEmail);
  await page.fill('input[name="password"]', testUserPassword);
  await page.click('button[type="submit"]');
  // Wait for login to complete
  await expect(page.getByText(/welcome|dashboard|home/i)).toBeVisible();
  // Now go to meetings page
  await page.goto('/meetings');
  await expect(page.getByRole('heading', { name: /meetings/i })).toBeVisible();
});

// Support page availability
test('Support page is available', async ({ page }) => {
  await page.goto('/support');
  await expect(page.getByRole('heading', { name: /support/i })).toBeVisible();
  // Optionally check for contact form or support info
});