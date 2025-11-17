'use client';

import { useSession } from 'next-auth/react';
// User type not needed in this component
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { createProfile } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CreateProfileSchema } from '@/lib/validationSchemas';

const onSubmit = async (data: {
  firstName: string;
  lastName: string;
  roomStatus: string;
  bio: string;
  image?: string | null;
  clean: string;
  budget: string;
  social: string;
  study: string;
  sleep: string;
}) => {
  // console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  await createProfile(data);
  swal('Success', 'Your Profile has been saved', 'success', {
    timer: 2000,
  });
};

const CreateProfile: React.FC = () => {
  const { data: session, status } = useSession();
  const currentUser = session?.user?.email as string;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateProfileSchema),
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
                          <Form.Label>First Name</Form.Label>
                          <input
                            type="text"
                            {...register('firstName')}
                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          />
                          <div className="invalid-feedback">{errors.firstName?.message}</div>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>Last Name</Form.Label>
                          <input
                            type="text"
                            {...register('lastName')}
                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          />
                          <div className="invalid-feedback">{errors.lastName?.message}</div>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>Room Status</Form.Label>
                          {/* Use the session email as the canonical value. Make it readOnly so user input isn't
                              accidentally overridden by another input. If you want users to edit it, remove
                              readOnly and the defaultValue will be the session email. */}
                          <select
                            {...register('roomStatus')}
                            className={`form-control ${errors.roomStatus ? 'is-invalid' : ''}`}
                            defaultValue="seeking"
                          >
                            <option value="seeking">Seeking Roommate</option>
                            <option value="offering">Offering Room</option>
                          </select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Form.Group>
                        <Form.Label>Your Bio</Form.Label>
                        <textarea {...register('bio')} className={`form-control ${errors.bio ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.bio?.message}</div>
                      </Form.Group>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>How do you keep your space?</Form.Label>
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
                          <select
                            {...register('budget')}
                            className={`form-control ${errors.budget ? 'is-invalid' : ''}`}
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
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
                {/* removed hidden input that duplicated the 'email' registration and overwrote user input */}
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

export default CreateProfile;
