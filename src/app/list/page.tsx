import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import RoommateDirectory from '@/components/RoommateDirectory';
import authOptions from '@/lib/authOptions';

const RoommateDirectoryPage = async () => {
  // Fetch profiles and include related user
  const profiles = await prisma.profile.findMany({
    include: { user: true }
  });

  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email;

  // Find the profile for the logged-in user by UHemail
  const currentUserProfile = profiles.find(
    (p) => p.user?.UHemail === currentUserEmail
  );

  return (
    <RoommateDirectory
      profiles={profiles}
      currentUserProfile={currentUserProfile}
    />
  );
};

export default RoommateDirectoryPage;
