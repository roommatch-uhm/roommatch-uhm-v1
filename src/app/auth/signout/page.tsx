'use client';

import { signOut } from 'next-auth/react';
import { Button, Col, Row, Container } from 'react-bootstrap';

/** Sign Out Confirmation Page */
export default function SignOutPage() {
  return (
    <Container className="text-center py-5">
      <h2 className="mb-4 text-uh-green">Are you sure you want to sign out?</h2>
      <Row className="justify-content-center gap-3">
        <Col xs="auto">
          <Button
            variant="danger"
            onClick={() => signOut({ callbackUrl: '/', redirect: true })}
          >
            Sign Out
          </Button>
        </Col>
        <Col xs="auto">
          <Button variant="secondary" href="/">
            Cancel
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

