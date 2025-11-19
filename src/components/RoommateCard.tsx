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
              src={profile.image}
              rounded
              style={{
                width: '100%',
                maxHeight: '200px',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      </Card.Body>
      <Card.Footer>
        <Link href={`/match/${profile.id}`}>View Details</Link>
      </Card.Footer>
    </Card>
  );
};

export default RoommateCard;
