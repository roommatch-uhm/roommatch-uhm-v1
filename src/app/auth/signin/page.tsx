'use client';

import { signIn } from 'next-auth/react';
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

/** The sign in page. */
const SignIn = () => {
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    if (!email.endsWith('@hawaii.edu')) {
      setError('Please use your @hawaii.edu email address.');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const callback = params.get('callbackUrl') ?? '/list';
    const result = await signIn('credentials', {
      callbackUrl: callback,
      email,
      password,
      redirect: false, // Prevent auto-redirect so we can handle errors
    });

    if (result?.error) {
      setError(result.error); // Show error to user
      return;
    }

    // If successful, redirect manually
    if (result?.url) {
      window.location.href = result.url;
    }
  };

  return (
    <main>
      <Container>
        <Row className="justify-content-center">
          <Col xs={5}>
            <h1 className="text-center">Sign In</h1>
            <Card>
              <Card.Body>
                <Form method="post" onSubmit={handleSubmit}>
                  {error && <div className="text-danger mb-2">{error}</div>}
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <input name="email" type="text" className="form-control" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <input name="password" type="password" className="form-control" />
                  </Form.Group>
                  <Button type="submit" className="mt-3">
                    Sign in
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer>
                Don&apos;t have an account?
                <a href="/auth/signup"> Sign up</a>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignIn;
