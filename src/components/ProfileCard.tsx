'use client';

import { Card, Image } from 'react-bootstrap';
import Link from 'next/link';
import { Profile } from '@prisma/client';

/* Renders a single row in the List Stuff table. See list/page.tsx. */
const ProfileCard = ({
  profile,
}: {
  profile: Profile;
}) => (
  <Card className="h-100">
    <Card.Header>
      <Image src={profile.image} alt="" width={75} />
      <Card.Title>
        {profile.firstName}
        &nbsp;
        {profile.lastName}
      </Card.Title>
      <Card.Subtitle>{profile.email}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <Card.Text>{profile.bio}</Card.Text>
      <Card.Text>Room Status: {profile.roomStatus}</Card.Text>
        <Card.Text>Cleanliness: {profile.clean}</Card.Text>
        <Card.Text>Budget: {profile.budget}</Card.Text>
        <Card.Text>Social Level: {profile.social}</Card.Text>
        <Card.Text>Study Habits: {profile.study}</Card.Text>
        <Card.Text>Sleep Schedule: {profile.sleep}</Card.Text>
    </Card.Body>
    <Card.Footer>
      <Link href={`edit/${profile.id}`}>Edit</Link>
    </Card.Footer>
  </Card>
);

export default ProfileCard;
