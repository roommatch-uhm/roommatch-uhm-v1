import { getServerSession } from 'next-auth';
import { Col, Container, Row } from 'react-bootstrap';
import { Profile } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import ProfileCard from '@/components/Card';

/** Render a list of matched profiles for the logged in user. */
const ListMatches = async () => {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
      // eslint-disable-next-line @typescript-eslint/comma-dangle
    } | null,
  ); 

  const profiles: Profile[] = await prisma.profile.findMany();

  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Row>
          <Col>
            <h1>RoomMatches</h1>
          </Col>
        </Row>
        <Row className="gy-4">
          {profiles.map((profile) => (
            <Col key = {profile.id} md={4} lg={3}>
              <ProfileCard profile={profile} />
            </Col>
          ))}
        </Row>
      </Container>
    </main>
  );
};

export default ListMatches;
