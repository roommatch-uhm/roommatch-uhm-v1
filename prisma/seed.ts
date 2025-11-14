import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json'; // Assuming your settings file exists

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');

  // Hashing the password for all users
  const password = await hash('changeme', 10);

  // Upsert users (ensure async handling)
  const upsertUserPromises = config.defaultAccounts.map(async (account) => {
    const role = account.role as Role || Role.USER;
    console.log(`  Creating user: ${account.UHemail} with role: ${role}`);

    // Upsert users: If the user exists, update; else, create
    await prisma.user.upsert({
      where: { UHemail: account.UHemail }, // Match UHemail as it's the unique field
      update: {}, // You can add fields to update if needed
      create: {
        UHemail: account.UHemail, // Make sure UHemail matches the field in the schema
        firstName: account.firstName || '', // Default to empty string if undefined
        lastName: account.lastName || '', // Default to empty string if undefined
        password, // Use hashed password
        role,
        preferences: account.preferences || '', // Default to empty string if undefined
        roommateStatus: account.roommateStatus || 'Looking', // Default to 'Looking' if undefined
        budget: account.budget || 0, // Default to 0 if undefined
      },
    });
  });

  // Await all user upserts
  await Promise.all(upsertUserPromises);

  // Optionally, you can also seed other entities like contacts, listings, etc.

  console.log('Seeding complete!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
