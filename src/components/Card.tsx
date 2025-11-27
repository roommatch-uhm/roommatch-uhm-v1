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

  // normalize DB path and ensure a usable src; fallback to default when missing
  const getImageSrc = (img?: string | null) => {
    if (!img) return '/uploads/default.jpg';
    let src = img;
    // remove accidental "public/" prefix
    if (src.startsWith('public/')) src = src.replace(/^public\//, '');
    // ensure leading slash for relative paths (uploads/xxx.jpg -> /uploads/xxx.jpg)
    if (!src.startsWith('/') && !/^https?:\/\//.test(src)) src = `/${src}`;
    return src;
  };

  const imgSrc = getImageSrc(profile.image ?? null);

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
              src={imgSrc}
              rounded
              onError={(e: any) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/uploads/default.jpg';
              }}
              style={{
                width: '100%',
                maxHeight: '350px',
                height: 'auto',
                objectFit: 'contain',
                backgroundColor: '#f8f9fa',
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
