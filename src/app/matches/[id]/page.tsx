'use client';

import { Container, Row, Col, Card, ListGroup, Badge, Button, ProgressBar, Image } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type Profile = {
    id: number;
    userId: number;
    image: string | null;
    name: string;
    description: string;
    budget: number;
    clean: string;
    social: string;
    study: string;
    sleep: string;
    compatibilityScore: number;
    housingPreference: string;
    locationPreference: string;
};

export default function profileDetailPage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  // Get your own userId from session
  const rawUserId = (session?.user as { id?: number | string } | undefined)?.id;
  const myUserId: number | undefined =
    typeof rawUserId === 'number'
      ? rawUserId
      : rawUserId
      ? parseInt(String(rawUserId), 10)
      : undefined;

  // Fetch the profile based on params.id
  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch(`/api/profiles/${params.id}`);
      const data = await res.json();
      setProfile(data);
    }
    fetchProfile();
  }, [params.id]);

  // Handler for starting a chat and redirecting
  const handleMessage = async () => {
    if (!myUserId || !profile) {
      alert('You must be signed in to send messages.');
      return;
    }
    // Create a new chat (or get existing one)
    const res = await fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId1: myUserId, userId2: profile.userId }),
    });
    const chat = await res.json();
    // Redirect to messages page with the new chat's ID
    router.push(`/messages?chatId=${chat.id}`);
  };

  //if (!profile) return <div>Loading...</div>;

  return (
    <Container className="py-4">
    <Row className="mb-3">
        <Col>
          <Link href="/list" className="text-decoration-none">
            &larr; Back to Browse Listings
          </Link>
        </Col>
      </Row>

      <Row>
        {/* Left column – main profile info */}
        <Col md={8} className="mb-4">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <Card.Title className="mb-1">{profile.name}</Card.Title>
                </div>
                <div className="text-end">
                  <div className="fw-bold">Compatibility Score</div>
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ minWidth: '80px' }}>
                      <ProgressBar
                        now={profile.compatibilityScore}
                        label={`${profile.compatibilityScore}%`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <Row className="mb-3">
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Budget:</strong> {profile.budget}
                    </ListGroup.Item>
                  </ListGroup>
                  <Image
                      src={profile.image || '/uploads/default.jpg'}
                      rounded
                      style={{
                         width: '100%',
                         maxHeight: '200px',
                         objectFit: 'contain',
                      }}
                  />
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Housing Preference:</strong> {profile.housingPreference}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Location Preference:</strong> {profile.locationPreference}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>

              <h5>About {profile.name.split(' ')[0]}</h5>
              <p>{profile.description}</p>
              <ul>
                  <li>Cleanliness: {profile.clean}</li>
                  <li>Sleep Schedule: {profile.sleep}</li>
                  <li>Study Habits: {profile.study}</li>
                  <li>Social Life: {profile.social}</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        {/* Right column – actions */}
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Connect with {profile.name.split(' ')[0]}</Card.Title>
              <Card.Text>
                Start a conversation or schedule a time to meet and talk about housing options.
              </Card.Text>
              <div className="d-grid gap-2">
                <Button variant="primary" onClick={handleMessage}>
                  Message
                </Button>
                <Link href="/meetings" passHref legacyBehavior>
                  <Button variant="outline-primary">
                    Schedule Meeting
                  </Button>
                </Link>
              </div>

              <hr />

              <small className="text-muted">
                Messaging and meetings are for UH Mānoa students only. Please be respectful and
                follow community guidelines when contacting potential roommates.
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
