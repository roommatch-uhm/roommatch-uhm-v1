'use client';

import Link from 'next/link';
import { Profile } from '@prisma/client';
import { Card, Image } from 'react-bootstrap';

const ProfileCard = ({ profile }: { profile?: Profile | null }) => {
  if (!profile) {
    return (
      <Card className="h-100">
        <Card.Body>
          <Card.Title>No profile found</Card.Title>
          <Card.Text>You don't have a profile yet.</Card.Text>
          <Link href="/create">Create your profile</Link>
        </Card.Body>
      </Card>
    );
  }

  const attributes = [
    profile.clean,
    profile.budget,
    profile.social,
    profile.study,
    profile.sleep,
  ].filter(Boolean);

  return (
    <Card
      style={{ minHeight: '500px', maxWidth: '700px' }} // smaller overall
      className="w-100 p-3 mx-auto"
    >
      {/* Header with name */}
      <Card.Header>
        <Card.Title className="mb-2">{profile.name}</Card.Title>
      </Card.Header>

      <Card.Body>
        <div className="d-flex">
          {/* Left side: bio + attributes (top-aligned) */}
          <div style={{ width: '50%', paddingRight: '1rem' }}>
            {/* Bio */}
            <Card.Text style={{ marginBottom: '0.75rem' }}>
              {
                'John is a software developer with a passion for building intuitive web applications. He enjoys collaborating with others, learning new technologies, and exploring creative solutions. In his free time, John likes hiking, reading science fiction, and experimenting with photography.'
              }
            </Card.Text>

            {/* Attributes */}
            <div className="d-flex flex-wrap gap-2">
              {attributes.map((attr, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1 rounded border bg-light text-muted small"
                  style={{ borderColor: '#ddd' }}
                >
                  {attr}
                </div>
              ))}
            </div>
          </div>

          {/* Right side: image */}
          <div
            style={{
              width: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start', // align top
            }}
          >
            <Image
              src="/images/johndoe.jpg"
              rounded
              style={{
                width: '100%',
                maxHeight: '200px', // smaller image
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      </Card.Body>

      <Card.Footer className="d-flex justify-content-between">
        <Link href="/messages">Chat</Link>
        <Link href={`/edit/${profile.id}`}>Edit</Link>
      </Card.Footer>
    </Card>
  );
};

export default ProfileCard;
