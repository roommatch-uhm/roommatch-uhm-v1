'use client';

import { Container, Row, Col, Card, ListGroup, Badge, Button, ProgressBar, Image } from 'react-bootstrap';
import Link from 'next/link';

type Profile = {
    id: number;
    image: string;
    name: string;
    description: string;
    budget: number;
    clean: string;
    social: string;
    study: string;
    sleep: string;
    compatabilityScore: number;
    housingPreference: string;
    locationPreference: string;
};

const mockProfile: Profile = {
    id: 1,
    image: "/images/johndoe.jpg",
    name: "John Doe",
    description: "A friendly and tidy roommate looking for a place near campus.",
    compatabilityScore: 85,
    budget: 700,
    clean: "Very Clean",
    social: "Moderately Social",
    study: "Focused",
    sleep: "Early Riser",
    housingPreference: "Apartment",
    locationPreference: "<5 minutes from Campus",
}

export default function profileDetailPage({ params }: { params: { id: string } }) {
  const profile = mockProfile;
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
                        now={profile.compatabilityScore}
                        label={`${profile.compatabilityScore}%`}
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
                      src="/images/johndoe.jpg"
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
                <Link href="/messages" passHref legacyBehavior>
                  <Button variant="primary">
                    Message
                  </Button>
                </Link>
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
