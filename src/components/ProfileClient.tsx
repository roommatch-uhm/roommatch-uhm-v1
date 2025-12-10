'use client';

import { Col, Container, Row } from 'react-bootstrap';
import Card from '@/components/Card';

export default function ProfileClient({ profile }: { profile: any }) {
  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Row>
          <Col>
            <Container
              className="d-flex justify-content-center"
              style={{ maxWidth: '1000px' }}
            >
              <Card profile={profile} />
            </Container>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
