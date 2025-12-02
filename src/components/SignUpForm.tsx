'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Card, Col, Container, Button, Form, Row } from 'react-bootstrap';
import { createUserProfile } from '@/lib/dbActions';
import { useState } from 'react';

type SignUpFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpForm() {
  const [serverError, setServerError] = useState('');

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format')
      .matches(/@hawaii\.edu$/, 'Please use your @hawaii.edu email'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await createUserProfile({
        UHemail: data.email,
        password: data.password,
        budget: 0,
        roommateStatus: 'Looking',
      });

      alert('Account created successfully! Redirecting...');
      await signIn('credentials', {
        callbackUrl: '/profile',
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error(error);
      setServerError('Sign-up failed. Please try again.');
    }
  };

  return (
    <main>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={5}>
            <h1 className="text-center text-uh-green mb-3">Create Your Account</h1>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      {...register('email')}
                      className={errors.email ? 'is-invalid' : ''}
                    />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      {...register('password')}
                      className={errors.password ? 'is-invalid' : ''}
                    />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      {...register('confirmPassword')}
                      className={errors.confirmPassword ? 'is-invalid' : ''}
                    />
                    <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                  </Form.Group>

                  {serverError && <p className="text-danger">{serverError}</p>}

                  <div className="d-flex justify-content-between mt-3">
                    <Button type="submit" className="btn-uh-green">
                      Register
                    </Button>
                    <Button variant="secondary" onClick={() => reset()}>
                      Reset
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer className="text-center">
                Already have an account?{' '}
                <a href="/auth/signin" className="text-uh-green fw-semibold">
                  Sign in
                </a>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
