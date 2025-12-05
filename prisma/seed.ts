import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

type SeedAccount = {
  id?: number;
  UHemail: string;
  username?: string;
  password?: string;
  role?: string;
  preferences?: string;
  roommateStatus?: string;
  imageData?: { type: 'Buffer'; data: number[] }; // <-- add this line
};

async function main() {
  console.log('Accounts to seed:', config.defaultAccounts);

  // // Clear the User table (for development only)
  // await prisma.user.deleteMany({});

  const upsertUserPromises = (config.defaultAccounts as SeedAccount[]).map(async (account) => {
    const role = (account.role as Role) || Role.USER;
    const hashedPassword = await hash(account.password || 'changeme', 10);

    // Defensive: ensure required fields exist
    if (!account.UHemail) {
      console.warn('Skipping account with missing UHemail:', account);
      return;
    }
    if (!account.username) {
      account.username = account.UHemail;
    }

    console.log(`  Creating user: ${account.UHemail} with role: ${role}`);

    // Upsert user and get the created/updated user object (including its id)
    const user = await prisma.user.upsert({
      where: { UHemail: account.UHemail },
      update: {
        username: account.username,
        password: hashedPassword,
        role,
        preferences: account.preferences || '',
        roommateStatus: account.roommateStatus || 'Looking',
      },
      create: {
        UHemail: account.UHemail,
        username: account.username,
        password: hashedPassword,
        role,
        preferences: account.preferences || '',
        roommateStatus: account.roommateStatus || 'Looking',
      },
    });

    // Upsert profile for this user using the correct user.id
    let imageBuffer: Buffer | null = null;
    if (account.imageData && account.imageData.type === 'Buffer' && Array.isArray(account.imageData.data)) {
      imageBuffer = Buffer.from(account.imageData.data);
    }

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        imageData: imageBuffer,
        name: '',
        description: '',
        clean: '',
        social: '',
        study: '',
        sleep: '',
      },
      create: {
        userId: user.id,
        imageData: imageBuffer,
        name: '',
        description: '',
        clean: '',
        social: '',
        study: '',
        sleep: '',
      }
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
