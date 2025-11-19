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
      <Card.Header>
        {profile.image ? <Image src={profile.image} width={75} /> : null}
        <Card.Title>{profile.name}</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          {profile.description}
          {profile.clean}
          {profile.budget}
          {profile.social}
          {profile.study}
          {profile.sleep}
        </Card.Text>
      </Card.Body>

      <Card.Footer className="d-flex justify-content-between">
        <Link href="/messages">Chat</Link>
        <Link href={`/edit/${profile.id}`}>Edit</Link>
      </Card.Footer>
    </Card>
  );
};

export default ProfileCard;
