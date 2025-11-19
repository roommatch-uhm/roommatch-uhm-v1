import { getServerSession } from 'next-auth';
import { Role } from '@prisma/client';
import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import Card from '@/components/Card';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';

/** Render a list of stuff for the logged in user. */
const ProfilePage = async () => {
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
    where: {
      id: owner,
    },
  });
  
  // console.log(profile);
  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Row>
          <Col>
            <h1>My Profile</h1>
            <Card profile={profile} />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ProfilePage;
