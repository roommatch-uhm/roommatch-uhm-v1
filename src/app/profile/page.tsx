import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import ProfileClient from '@/components/ProfileClient';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';

const ProfilePage = async () => {
  // Get the session
  const session = await getServerSession(authOptions);

  // Ensure the user is logged in
  const typedSession = session as unknown as {
    user: { email: string; id: string };
  } | null;
  loggedInProtectedPage(typedSession, '/create');

  if (!typedSession?.user?.id) return null;

  const userId = parseInt(typedSession.user.id, 10);

  // Fetch the profile for this user
  const profile = await prisma.profile.findFirst({
    where: { userId: userId }, // findFirst works even if field is unique or not
  });

  return <ProfileClient profile={profile} />;
};

export default ProfilePage;
