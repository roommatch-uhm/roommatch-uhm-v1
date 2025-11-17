'use client';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateUserProfile } from '@/lib/dbActions';
import AddUserSchema from '@/lib/validationSchemas';

const EditUserForm = ({ user }: { user: any }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddUserSchema),
    defaultValues: user,
  });

  const onSubmit = async (data: any) => {
    await updateUserProfile(user.id, data);
    swal('Success', 'User profile updated', 'success', { timer: 2000 });
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Edit User</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <input
                    type="text"
                    {...register('firstName')}
                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">
                    {typeof errors.firstName?.message === 'string' ? errors.firstName.message : ''}
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <input
                    type="text"
                    {...register('lastName')}
                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">
                    {typeof errors.lastName?.message === 'string' ? errors.lastName.message : ''}
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>UH Email</Form.Label>
                  <input
                    type="email"
                    {...register('UHemail')}
                    className={`form-control ${errors.UHemail ? 'is-invalid' : ''}`}
                    disabled
                  />
                  <div className="invalid-feedback">
                    {typeof errors.UHemail?.message === 'string' ? errors.UHemail.message : ''}
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Roommate Status</Form.Label>
                  <select
                    {...register('roommateStatus')}
                    className={`form-control ${errors.roommateStatus ? 'is-invalid' : ''}`}
                  >
                    <option value="Looking">Looking</option>
                    <option value="Not Looking">Not Looking</option>
                    <option value="Has Roommate">Has Roommate</option>
                  </select>
                  <div className="invalid-feedback">
                    {typeof errors.roommateStatus?.message === 'string' ? errors.roommateStatus.message : ''}
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Budget</Form.Label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('budget')}
                    className={`form-control ${errors.budget ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">
                    {typeof errors.budget?.message === 'string' ? errors.budget.message : ''}
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Preferences</Form.Label>
                  <input
                    type="text"
                    {...register('preferences')}
                    className={`form-control ${errors.preferences ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">
                    {typeof errors.preferences?.message === 'string' ? errors.preferences.message : ''}
                  </div>
                </Form.Group>
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

export default EditUserForm;
