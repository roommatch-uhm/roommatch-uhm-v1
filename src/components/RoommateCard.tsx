'use client';

import Link from 'next/link';
import { Card, Image } from 'react-bootstrap';
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

  const getImageSrc = (img?: string | null) => {
    if (!img) return '/uploads/default.jpg';
    let src = img;
    if (src.startsWith('public/')) src = src.replace(/^public\//, '');
    if (!src.startsWith('/') && !/^https?:\/\//.test(src)) src = `/${src}`;
    return src;
  };

  const imgSrc = getImageSrc(profile.image ?? null);

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
              alignItems: 'flex-start', // align top
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
                maxHeight: '350px', // allow taller images
                height: 'auto',
                objectFit: 'contain', // don't crop; preserve aspect
                backgroundColor: '#f8f9fa', // subtle background for letterboxing
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
