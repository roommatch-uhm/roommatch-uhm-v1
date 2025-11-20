import { prisma } from '@/lib/prisma';
import { Profile } from '@prisma/client';
import RoommateDirectory from '@/components/RoommateDirectory';

const RoommateDirectoryPage = async () => {
  // Fetch profiles server-side
  const profiles: Profile[] = await prisma.profile.findMany();

  return <RoommateDirectory profiles={profiles} />;
};

export default RoommateDirectoryPage;
