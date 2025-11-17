'use client';

import Link from 'next/link';
import { Profile } from '@prisma/client';
import { Card, Image } from 'react-bootstrap';

const ProfileCard = ({ profile }: { profile: Profile }) => (
  <Card className="h-100">
    <Card.Header>
      <Image src={profile.image} width={75} />
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
    <Card.Footer>
      <Link href="/messages">Chat</Link>
      <Link href={`edit/${profile.id}`}>Edit</Link>
    </Card.Footer>
  </Card>
);

export default ProfileCard;
