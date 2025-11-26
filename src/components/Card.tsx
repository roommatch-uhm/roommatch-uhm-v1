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
    profile.budget ? `$${profile.budget}` : null,
    profile.social,
    profile.study,
    profile.sleep,
  ].filter(Boolean);

  return (
    <Card
      style={{ minHeight: '400px', maxWidth: '700px' }}
      className="w-100 p-3 mx-auto"
    >
      <Card.Header>
        <Card.Title className="mb-2">{profile.name}</Card.Title>
      </Card.Header>

      <Card.Body>
        <div className="d-flex flex-wrap gap-3">
          {/* Left: bio + attributes */}
          <div style={{ flex: '1 1 45%' }}>
            <Card.Text style={{ marginBottom: '0.75rem' }}>
              {profile.description}
            </Card.Text>
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

          {/* Right: uploaded image */}
          <div
            style={{
              flex: '1 1 45%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <Image
              src={profile.image || '/public/images/default.jpg'}
              rounded
              style={{
                width: '100%',
                maxHeight: '200px',
                objectFit: 'cover',
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
