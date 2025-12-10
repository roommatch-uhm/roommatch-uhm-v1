
'use client';

import Link from 'next/link';
import { Card, Image } from 'react-bootstrap';
import React from 'react';
import { Profile } from '@prisma/client';

const ProfileCard = ({ profile }: { profile?: Profile | null }) => {
  if (!profile) {
    return (
      <Card className="h-100 shadow-sm">
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
    <Card className="w-100 mx-auto shadow-lg" style={{ borderRadius: 12, overflow: 'hidden' }}>
      <div
        style={{
          background: 'linear-gradient(135deg,#6a11cb 0%,#2575fc 100%)',
          color: '#fff',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{ width: 96, height: 96, flex: '0 0 96px' }}>
          <Image
            src={imgSrc}
            alt={profile.name || 'Profile'}
            roundedCircle
            onError={(e: any) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/uploads/default.jpg';
            }}
            style={{
              width: 96,
              height: 96,
              objectFit: 'cover',
              border: '3px solid rgba(255,255,255,0.18)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontWeight: 700 }}>{profile.name}</h3>
          <div style={{ opacity: 0.9, marginTop: 6 }}>{profile.description?.slice(0, 120) || 'No description'}</div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              padding: '6px 10px',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {profile.budget ? `$${profile.budget}` : 'No budget'}
          </div>
        </div>
      </div>

      <Card.Body style={{ background: '#fff' }}>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {attributes.map((attr, idx) => (
            <span
              key={idx}
              style={{
                background: '#f1f5f9',
                padding: '6px 10px',
                borderRadius: 16,
                fontSize: 13,
                color: '#333',
                boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.02)',
              }}
            >
              {attr}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <h5 style={{ marginBottom: 8 }}>About</h5>
            <p style={{ marginBottom: 0, color: '#555' }}>{profile.description}</p>
          </div>

          <div style={{ width: 260 }}>
            <div
              style={{
                borderRadius: 8,
                overflow: 'hidden',
                background: '#fafafa',
                border: '1px solid #eee',
                padding: 8,
              }}
            >
              <Image
                src={imgSrc}
                alt={profile.name || 'Profile'}
                rounded
                onError={(e: any) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/uploads/default.jpg';
                }}
                style={{
                  width: '100%',
                  height: 220,
                  objectFit: 'contain',
                  background: '#fff',
                }}
              />
            </div>
          </div>
        </div>
      </Card.Body>

      <Card.Footer className="d-flex justify-content-between align-items-center" style={{ background: '#fff' }}>
        <Link href="/messages" style={{ color: '#2575fc', fontWeight: 600 }}>
          Chat
        </Link>
        <Link href={`/edit/${profile.id}?refresh=${Date.now()}`} style={{ color: '#2575fc', fontWeight: 600 }}>
          Edit
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default ProfileCard;
