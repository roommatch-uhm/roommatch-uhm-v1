import { prisma } from '@/lib/prisma';
import { Profile } from '@prisma/client';
import RoommateDirectory from '@/components/RoommateDirectory';

const RoommateDirectoryPage = async () => {
  let profiles: Profile[] = [];

  try {
    profiles = await prisma.profile.findMany();
  } catch (err) {
    // DB/schema mismatch can cause the query to fail; log and fall back to empty list
    console.error('Failed to fetch profiles (DB/schema mismatch):', err);
  }

  const currentUserProfile: Profile | null = (profiles[0] ?? null) as Profile | null;

  return <RoommateDirectory profiles={profiles} currentUserProfile={currentUserProfile} />;
};

export default RoommateDirectoryPage;
