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
    <Card className="h-100">
      <Card.Header className="d-flex align-items-center">
        {profile.image ? (
          <Image
            src={profile.image}
            width={75}
            height={75}
            alt={`${profile.name} profile`}
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.src = '/images/logo-option-1.png';
            }}
            roundedCircle
            className="me-2"
          />
        ) : null}
        <Card.Title className="mb-0">{profile.name}</Card.Title>
      </Card.Header>

      <Card.Body className="d-flex">
        {/* Left side: bio + attributes */}
        <div className="flex-grow-1" style={{ maxWidth: '60%' }}>
          <Card.Text style={{ marginBottom: '1rem' }}>
            {profile.description || 'No bio available.'}
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

        {/* Right side: large image */}
        <div
          className="d-flex justify-content-end align-items-start"
          style={{ width: '40%' }}
        >
          {profile.image && (
            <Image
              src={profile.image}
              rounded
              alt={`${profile.name} full`}
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                img.src = '/images/logo-option-1.png';
              }}
              style={{ width: '100%', objectFit: 'cover', maxHeight: '220px' }}
            />
          )}
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
