import { getServerSession } from 'next-auth';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import ProfileClient from '@/components/ProfileClient';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
  const typedSession = session as unknown as {
    user: { email: string; id: string; role: Role };
  } | null;
  loggedInProtectedPage(typedSession, '/create');
  const owner = typedSession?.user?.id ? parseInt(typedSession.user.id, 10) : 0;
  const profile = await prisma.profile.findUnique({
    where: { id: owner },
  });

  return <ProfileClient profile={profile} />;
};

export default ProfilePage;
