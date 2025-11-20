import { prisma } from '@/lib/prisma';
import { Profile } from '@prisma/client';
import RoommateDirectory from '@/components/RoommateDirectory';

const RoommateDirectoryPage = async () => {
  // Fetch profiles server-side
  const profiles: Profile[] = await prisma.profile.findMany();

  // Use the first profile as the current user profile (fallback)
  const currentUserProfile: Profile = profiles[0] as Profile;

  return <RoommateDirectory profiles={profiles} currentUserProfile={currentUserProfile} />;
};

export default RoommateDirectoryPage;
