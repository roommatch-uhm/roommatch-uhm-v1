import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as config from '../config/settings.development.json';
import profiles from './seed-data/accounts.json';

const prisma = new PrismaClient();

type SeedAccount = {
  id?: number;
  UHemail: string;
  username?: string;
  password?: string;
  role?: string;
  preferences?: string;
  roommateStatus?: string;
  image?: string;
  imageData?: { type: 'Buffer'; data: number[] };
  name?: string;
  description?: string;
  clean?: string;
  social?: string;
  study?: string;
  sleep?: string;
  budget?: number;
};

async function main() {
  console.log('Accounts to seed:', (config as any).defaultAccounts?.length ?? 0);

  const upsertUserPromises = ((config as any).defaultAccounts as SeedAccount[]).map(async (account) => {
    const role = (account.role as Role) || Role.USER;
    const hashedPassword = await hash(account.password || 'changeme', 10);

    if (!account.UHemail) {
      console.warn('Skipping account with missing UHemail:', account);
      return;
    }
    if (!account.username) {
      account.username = account.UHemail.split('@')[0];
    }

    console.log(`  Creating user: ${account.UHemail} with role: ${role}`);

    // 1) Try normal Prisma upsert (preferred)
    let user: any;
    try {
      user = await prisma.user.upsert({
        where: { UHemail: account.UHemail },
        update: {
          username: account.username,
          password: hashedPassword,
          role,
          preferences: account.preferences || '',
          roommateStatus: account.roommateStatus || 'Looking',
          budget: account.budget ?? null,
        },
        create: {
          UHemail: account.UHemail,
          username: account.username,
          password: hashedPassword,
          role,
          preferences: account.preferences || '',
          roommateStatus: account.roommateStatus || 'Looking',
          budget: account.budget ?? null,
        },
      });
    } catch (err: any) {
      // 2) If DB is missing the username column (P2022), fall back to raw queries
      if (err?.code === 'P2022' && err?.meta?.column === 'username') {
        console.warn('Database missing "username" column — falling back to raw SQL upsert for user.');

        // Try find by email first
        const existing: any[] = await (prisma as any).$queryRaw`SELECT id, "UHemail" FROM "User" WHERE "UHemail" = ${account.UHemail} LIMIT 1`;
        if (existing && existing.length > 0) {
          const existingId = existing[0].id;
          // Update allowed columns via raw SQL
          await (prisma as any).$executeRaw`UPDATE "User" SET "password" = ${hashedPassword}, "role" = ${role}, "preferences" = ${account.preferences || ''}, "roommateStatus" = ${account.roommateStatus || 'Looking'}, "budget" = ${account.budget ?? null} WHERE id = ${existingId}`;
          user = (await (prisma as any).$queryRaw`SELECT * FROM "User" WHERE id = ${existingId} LIMIT 1`)[0];
        } else {
          // Insert without username column
          const inserted: any[] = await (prisma as any).$queryRaw`
            INSERT INTO "User" ("UHemail","password","role","preferences","roommateStatus","budget")
            VALUES (${account.UHemail}, ${hashedPassword}, ${role}, ${account.preferences || ''}, ${account.roommateStatus || 'Looking'}, ${account.budget ?? null})
            RETURNING *`;
          user = inserted[0];
        }
      } else {
        throw err;
      }
    }

    if (!user) {
      throw new Error('User creation failed unexpectedly for ' + account.UHemail);
    }

    // Upsert profile for this user using the correct user.id
    // Build profile payload; we will try to upsert with imageUrl fields first,
    // but fall back to a reduced payload if the client/db rejects unknown args.
    const profilePayload: any = {
      userId: user.id,
      imageData: account.imageData ? Buffer.from(account.imageData.data) : undefined,
      imageAddedAt: account.imageData ? new Date() : null,
      name: account.name || '',
      description: account.description || '',
      clean: account.clean || '',
      budget: account.budget ?? null,
      social: account.social || '',
      study: account.study || '',
      sleep: account.sleep || '',
    };

    // Try Prisma upsert for profile, if it fails due to unknown args (schema mismatch),
    // remove image-related keys and retry.
    try {
      await prisma.profile.upsert({
        where: { userId: user.id },
        update: profilePayload,
        create: profilePayload,
      });
    } catch (err: any) {
      // If error indicates unknown argument/column for image fields, retry without them
      const isMissingImageField = err?.message?.includes('Unknown argument') || err?.code === 'P2022';
      if (isMissingImageField) {
        console.warn('Profile upsert failed with image fields — retrying without image fields.');
        const reduced = { ...profilePayload };
        delete reduced.imageUrl;
        delete reduced.imageKey;
        delete reduced.imageSource;
        delete reduced.imageAddedAt;

        try {
          await prisma.profile.upsert({
            where: { userId: user.id },
            update: reduced,
            create: reduced,
          });
        } catch (innerErr) {
          console.error('Failed to upsert profile (reduced) for userId', user.id, innerErr);
          throw innerErr;
        }
      } else {
        console.error('Failed to upsert profile for userId', user.id, err);
        throw err;
      }
    }
  });

  await Promise.all(upsertUserPromises);

  console.log('User seeding complete!');

  if (profiles && profiles.length > 0) {
    console.log('Profiles to seed:', profiles.length);
    await prisma.profile.createMany({
      data: profiles,
      skipDuplicates: true,
    });
    console.log('Profile seeding complete!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
