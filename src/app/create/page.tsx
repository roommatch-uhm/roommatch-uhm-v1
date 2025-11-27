import { getServerSession } from 'next-auth';
import { Role } from '@prisma/client';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import CreateProfile from '@/components/CreateProfile';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

const CreateProfilePage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  // Narrow the session to the shape we expect (id is a string from NextAuth)
  const typedSession = session as unknown as {
    user: { email: string; id: string; role: Role };
  } | null;
  loggedInProtectedPage(typedSession, '/create');

  console.log('CreateProfilePage session:', typedSession);
  // NextAuth stores the id as a string in the token; convert to number for Prisma
  const owner = typedSession?.user?.id ? parseInt(typedSession.user.id, 10) : 0;
  const profile = await prisma.profile.findUnique({
    where: { userId: owner }, // use userId now
  });

  if (profile) {
    // If profile exists, redirect to profile page
    redirect('/profile');
  }

  return (
    <main>
      <CreateProfile />
    </main>
  );
};

export default CreateProfilePage;
