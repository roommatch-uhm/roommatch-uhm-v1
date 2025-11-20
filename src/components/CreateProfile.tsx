'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { createProfile } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CreateProfileSchema } from '@/lib/validationSchemas';

type FormValues = {
  name: string;
  description: string;
  image?: string | null; // allow null/undefined to match the schema
  clean: 'excellent' | 'good' | 'fair' | 'poor';
  budget?: number | null;
  social: 'Introvert' | 'Ambivert' | 'Extrovert' | 'Unsure';
  study: 'Cramming' | 'Regular' | 'None';
  sleep: 'Early_Bird' | 'Night_Owl' | 'Flexible';
};

const onSubmit: SubmitHandler<FormValues> = async (data) => {
  await createProfile(data as any);
  swal('Success', 'Your Profile has been saved', 'success', {
    timer: 2000,
  });
};

const CreateUserProfile: React.FC = () => {
  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(CreateProfileSchema),
    defaultValues: {
      image: '', // <-- set default value
    },
  });

  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={500}>
          <Col className="text-center">
            <h2>Create your Profile</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>Name</Form.Label>
                          <input
                            type="text"
                            {...register('name')}
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          />
                          <div className="invalid-feedback">{errors.name?.message}</div>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Form.Group>
                        <Form.Label>Your Description</Form.Label>
                        <textarea {...register('description')} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.description?.message}</div>
                      </Form.Group>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>How clean do you keep your space?</Form.Label>
                          <select {...register('clean')} className={`form-control ${errors.clean ? 'is-invalid' : ''}`}>
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                            <option value="poor">Poor</option>
                          </select>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>What is your budget?</Form.Label>
                          <input
                            type="number"
                            step="100.00"
                            {...register('budget')}
                            className={`form-control ${errors.budget ? 'is-invalid' : ''}`}
                          />
                          <div className="invalid-feedback">{errors.budget?.message}</div>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>How would you describe your social life?</Form.Label>
                          <select
                            {...register('social')}
                            className={`form-control ${errors.social ? 'is-invalid' : ''}`}
                          >
                            <option value="Introvert">Introvert</option>
                            <option value="Ambivert">Ambivert</option>
                            <option value="Extrovert">Extrovert</option>
                            <option value="Unsure">Unsure</option>
                          </select>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>What are your study habits?</Form.Label>
                          <select {...register('study')} className={`form-control ${errors.study ? 'is-invalid' : ''}`}>
                            <option value="Cramming">Cramming</option>
                            <option value="Regular">Regular</option>
                            <option value="None">None</option>
                          </select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>What is your sleep schedule?</Form.Label>
                          <select {...register('sleep')} className={`form-control ${errors.sleep ? 'is-invalid' : ''}`}>
                            <option value="Early_Bird">Early Bird</option>
                            <option value="Night_Owl">Night Owl</option>
                            <option value="Flexible">Flexible</option>
                          </select>
                          <div className="invalid-feedback">{errors.sleep?.message}</div>
                        </Form.Group>
                      </Col>
                      <Col />
                    </Row>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Profile Image URL</Form.Label>
                      <input
                        type="text"
                        {...register('image')}
                        className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.image?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button type="button" onClick={() => reset()} variant="warning" className="float-right">
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateUserProfile;
