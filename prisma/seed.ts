import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Accounts to seed:', config.defaultAccounts);

  // // Clear the User table (for development only)
  // await prisma.user.deleteMany({});

  const upsertUserPromises = config.defaultAccounts.map(async (account) => {
    const role = (account.role as Role) || Role.USER;
    const hashedPassword = await hash(account.password || 'changeme', 10);

    console.log(`  Creating user: ${account.UHemail} with role: ${role}`);

    // Upsert user and get the created/updated user object (including its id)
    const user = await prisma.user.upsert({
      where: { UHemail: account.UHemail },
      update: {},
      create: {
        UHemail: account.UHemail,
        firstName: account.firstName || '',
        lastName: account.lastName || '',
        password: hashedPassword,
        role,
        preferences: account.preferences || '',
        roommateStatus: account.roommateStatus || 'Looking',
        budget: account.budget ?? null,
      },
    });

    // Upsert profile for this user using the correct user.id
    // Cast to `any` to avoid strict Prisma create input requirements in this seed script;
    // for production, provide all required profile fields or update the Prisma schema.
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {},
        create: {
        userId: user.id,
        image: account.image || null,
        name: (
          [account.firstName, account.lastName].filter(Boolean).join(' ').trim() ||
          (account as any).displayName ||
          account.UHemail ||
          'Unknown'
        ),
        description: account.description || '',
        clean: account.clean || '',
        budget: account.budget ?? null,
        social: account.social || '',
        study: account.study || '',
        sleep: account.sleep || '',
      },
    });
  });

  await Promise.all(upsertUserPromises);

  console.log('Seeding complete!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
