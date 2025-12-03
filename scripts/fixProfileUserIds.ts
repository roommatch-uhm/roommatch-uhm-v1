import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    // Check if this user already has a profile
    let profile = await prisma.profile.findFirst({
      where: { userId: user.id },
    });

    if (!profile) {
      // Create a new profile with default values
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          name: user.UHemail, // Use UHemail or a default string, since firstName/lastName do not exist
          description: 'No description yet.',
          clean: 'Unknown',
          budget: user.budget ?? 0,
          social: 'Unknown',
          study: 'Unknown',
          sleep: 'Unknown',
        },
      });
      console.log(`Created new profile ${profile.id} for user ${user.id}`);
    } else {
      console.log(`User ${user.id} already has profile ${profile.id}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
