'use client';

import Link from 'next/link';
import { Card, Image } from 'react-bootstrap';
import React from 'react';
import { Profile } from '@prisma/client';

type ExtendedProfile = Profile & {
  // imageData is not part of the Prisma Profile by default, but some server responses
  // may include binary image bytes; make it optional here so TS doesn't complain.
  imageData?: Buffer | Uint8Array | number[] | string | null;
};

interface RoommateCardProps {
  profile: ExtendedProfile;
}

const RoommateCard = ({ profile }: RoommateCardProps) => {
  const attributes = [
    profile.clean ? 'Clean' : 'Unspecified',
  ];

  // Determine image source: prefer imageUrl; if binary imageData is provided (e.g. from server), convert to base64, fallback to default avatar
  const getImageSrc = () => {
    // Prefer an explicit URL if available (this comes from Prisma Profile)
    if ((profile as any).imageUrl) {
      return (profile as any).imageUrl as string;
    }

    // Support optional binary imageData when provided by server (not part of Prisma Profile by default)
    const imageData = (profile as any).imageData as Buffer | Uint8Array | number[] | string | undefined | null;
    if (imageData) {
      // Convert Buffer/Uint8Array/string to base64 string
      const base64 =
        typeof Buffer !== 'undefined' && (Buffer as any).from
          ? Buffer.from(imageData as any).toString('base64')
          : typeof btoa !== 'undefined'
          ? btoa(String.fromCharCode(...new Uint8Array(imageData as any)))
          : String(imageData);
      return `data:image/jpeg;base64,${base64}`;
    }

    return '/uploads/default.jpg';
  };

  const imgSrc = getImageSrc();

  return (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex">
          {/* Left side: bio + attributes */}
          <div style={{ width: '50%', paddingRight: '1rem' }}>
            <Card.Title>{profile.name}</Card.Title>
            <Card.Text style={{ marginBottom: '0.75rem' }}>
              {profile.description || 'No description available.'}
            </Card.Text>
            <div className="d-flex flex-wrap gap-2">
              {attributes.map((attr, idx) => (
                <div
                  key={idx}
                  className="px-2 py-1 border rounded bg-light text-muted small"
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
              alignItems: 'flex-start',
            }}
          >
            <Image
              src={imgSrc}
              alt={`${profile.name} profile`}
              rounded
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                const imgEl = e.currentTarget as HTMLImageElement;
                imgEl.onerror = null;
                imgEl.src = '/uploads/default.jpg';
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
      <Card.Footer>
        <Link href={`/matches/${profile.id}`}>View Details</Link>
      </Card.Footer>
    </Card>
  );
};

export default RoommateCard;
