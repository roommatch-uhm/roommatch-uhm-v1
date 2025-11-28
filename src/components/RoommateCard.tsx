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
    profile.budget ? `$${profile.budget}` : null,
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
    <Card
      className="h-100"
      style={{
        position: 'relative', // for left accent
        borderRadius: 12,
        overflow: 'hidden',
        border: 'none',
        boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
        background: '#ffffff',
      }}
    >
      {/* vertical blue accent on left */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          background: 'linear-gradient(180deg,#60a5fa,#3b82f6)',
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
        }}
      />

      <Card.Body style={{ padding: 18 }}>
        <div className="d-flex" style={{ gap: 16 }}>
          {/* Left side: bio + attributes */}
          <div style={{ width: '50%', paddingRight: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>
                {profile.name}
              </div>
              <div style={{ marginTop: 6, color: '#475569', fontSize: 13 }}>
                {profile.description || 'No description available.'}
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {attributes.map((attr, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 999,
                    background: '#f1f5f9',
                    color: '#0f172a',
                    fontSize: 13,
                    fontWeight: 600,
                    boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.02)',
                  }}
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
            <div
              style={{
                width: '100%',
                maxWidth: 360,
                borderRadius: 10,
                overflow: 'hidden',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
              }}
            >
              <Image
                src={imgSrc}
                alt={`${profile.name} profile`}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  const imgEl = e.currentTarget as HTMLImageElement;
                  imgEl.onerror = null;
                  imgEl.src = '/uploads/default.jpg';
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  maxHeight: 350,
                  objectFit: 'contain', // preserve full image, no crop
                  backgroundColor: 'transparent',
                }}
              />
            </div>
          </div>
        </div>
      </Card.Body>

      <Card.Footer
        style={{
          display: 'flex',
          justifyContent: 'flex-end', // bottom-right placement
          alignItems: 'center',
          gap: 12,
          background: '#fff',
          borderTop: '1px solid rgba(15,23,42,0.03)',
          padding: '12px 18px',
        }}
      >
        <Link href={`/matches/${profile.id}`} legacyBehavior>
          <a
            style={{
              textDecoration: 'none',
              padding: '8px 14px',
              borderRadius: 999,
              background: '#eaf5ff', // light blue pill
              color: '#0f172a',
              fontWeight: 800,
              letterSpacing: 0.2,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              border: '1px solid rgba(37,99,235,0.12)',
              transition: 'transform 120ms ease, box-shadow 120ms ease, background 120ms ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'translateY(-2px)';
              el.style.background = '#d5ecff';
              el.style.boxShadow = '0 10px 26px rgba(37,99,235,0.08)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'translateY(0)';
              el.style.background = '#eaf5ff';
              el.style.boxShadow = 'none';
            }}
            aria-label={`View details for ${profile.name}`}
          >
            {/* slim eye icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
              <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View Details
          </a>
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default RoommateCard;
