import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import ProfileClient from '@/components/ProfileClient';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import { Role } from '@prisma/client';

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  const typedSession = session as unknown as {
    user: { email: string; id: string; role: Role };
  } | null;

  loggedInProtectedPage(typedSession, '/create');

  if (!typedSession?.user) return null;

  // Try numeric id first; fall back to lookup by email if id is not numeric
  const rawId = typedSession.user.id;
  const userIdNum = Number(rawId);
  let profile = null;

  try {
    if (!Number.isNaN(userIdNum)) {
      profile = await prisma.profile.findUnique({ where: { userId: userIdNum } });
    }

    if (!profile && typedSession.user.email) {
      // fallback: find profile by the related user's email
      profile = await prisma.profile.findFirst({
        where: { user: { UHemail: typedSession.user.email } },
      });
    }

    // server-side debug log (dev only)
    // eslint-disable-next-line no-console
    console.log('ProfilePage: resolved userIdNum=', Number.isNaN(userIdNum) ? 'NaN' : userIdNum, 'email=', typedSession.user.email, 'profileFound=', !!profile);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('ProfilePage error fetching profile:', err);
    profile = null;
  }

  return <ProfileClient profile={profile} />;
};

export default ProfilePage;
