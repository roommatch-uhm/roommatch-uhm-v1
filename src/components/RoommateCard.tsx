'use client';

import Link from 'next/link';
import { Card, Image } from 'react-bootstrap';
import React from 'react';
import { Profile } from '@prisma/client';

interface RoommateCardProps {
  profile: Profile;
}

const RoommateCard = ({ profile }: RoommateCardProps) => {
  const attributes = [
    profile.clean,
    profile.budget,
    profile.social,
    profile.study,
    profile.sleep,
  ].filter(Boolean);

  // Use imageData (bytes) for profile image, fallback to default avatar
  const getImageSrc = () => {
    if (profile.imageData) {
      // Convert Buffer/Uint8Array to base64 string
      const base64 =
        typeof Buffer !== 'undefined'
          ? Buffer.from(profile.imageData).toString('base64')
          : btoa(String.fromCharCode(...new Uint8Array(profile.imageData as any)));
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
