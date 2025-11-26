'use client';

import { Container, Row, Col, Card, ListGroup, Badge, Button, ProgressBar, Image } from 'react-bootstrap';
import Link from 'next/link';

type Profile = {
    id: number;
    image: string | null;
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
        {/* Left column */}
        <Col md={8} className="mb-4">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <Card.Title className="mb-1">{profile.name}</Card.Title>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <Badge bg="light" text="dark">
                      Budget: ${profile.budget}
                    </Badge>
                    <Badge bg="light" text="dark">
                      Housing: {profile.housingPreference}
                    </Badge>
                    <Badge bg="light" text="dark">
                      Location: {profile.locationPreference}
                    </Badge>
                  </div>
                </div>

                <div className="text-end">
                  <div className="fw-bold small text-muted mb-1">Compatibility Score</div>
                  <div style={{ minWidth: '140px'}}>
                    <ProgressBar
                      now={profile.compatabilityScore}
                      label={`${profile.compatabilityScore}%`}
                    />
                  </div>
                </div>
              </div>

              <hr />

              <Row className="align-items-start">
                <Col md={4} className="mb-3 mb-md-0">
                  <Image
                      src={profile.image ?? '/images/johndoe.jpg'}
                      alt={profile.name}
                      rounded
                      style={{
                         width: '100%',
                         maxHeight: '100%',
                         objectFit: 'cover',
                      }}
                  />
                </Col>
                <Col md={8}>
                  <h5 className="mb-2">About {profile.name.split(' ')[0]}</h5>
                  <p className="mb-3">{profile.description}</p>

                  <h6 className="mb-2">Preferences</h6>
                  <ul className="mb-0 list-unstyled small">
                    <li><strong>Cleanliness:</strong> {profile.clean}</li>
                    <li><strong>Sleep Schedule:</strong> {profile.sleep}</li>
                    <li><strong>Study Habits:</strong> {profile.study}</li>
                    <li><strong>Social Life:</strong> {profile.social}</li>
                  </ul>
                </Col>
              </Row>
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
