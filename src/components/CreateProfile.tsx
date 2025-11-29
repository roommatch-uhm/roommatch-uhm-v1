'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { CreateProfileSchema } from '@/lib/validationSchemas';
import { createProfile } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProfileImageUpload from '@/components/UploadImg';
import type { CreateProfileInput } from '@/lib/dbActions';

export default function CreateProfileForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProfileInput>({
    resolver: yupResolver(CreateProfileSchema),
    defaultValues: {
      userId: Number((session as any)?.user?.id ?? 0),
      name: '',
      description: '',
      image: null,
      clean: 'good',
      budget: 0,
      social: 'Unsure',
      study: 'Regular',
      sleep: 'Flexible',
    },
  });

  useEffect(() => {
    // keep userId synced if session becomes available later
    if (session?.user?.id) {
      setValue('userId', Number((session as any).user.id));
    }
  }, [session, setValue]);

  const onSubmit: SubmitHandler<CreateProfileInput> = async (data) => {
    try {
      await createProfile(data);
      swal('Success', 'Profile created', 'success');
      router.push('/profile');
    } catch (err) {
      console.error(err);
      swal('Error', 'Could not create profile', 'error');
    }
  };

  if (!session) {
    return <LoadingSpinner />;
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow" style={{ borderRadius: 14, overflow: 'hidden' }}>
            <div
              style={{
                background: 'linear-gradient(90deg, rgba(37,117,252,0.06), rgba(106,17,203,0.04))',
                padding: '18px 22px',
                borderBottom: '1px solid rgba(0,0,0,0.03)',
              }}
            >
              <h2 style={{ margin: 0, fontWeight: 700 }}>Create your Profile</h2>
              <div style={{ color: '#666', marginTop: 6 }}>Tell others a bit about yourself</div>
            </div>

            <Card.Body style={{ background: '#fff' }}>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={7}>
                    {/* Name */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Name</Form.Label>
                      <input
                        type="text"
                        {...register('name')}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)' }}
                      />
                      {errors.name && <div className="invalid-feedback d-block">{String(errors.name?.message)}</div>}
                    </Form.Group>

                    {/* Description */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Description</Form.Label>
                      <textarea
                        {...register('description')}
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        rows={4}
                        style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)' }}
                      />
                      {errors.description && (
                        <div className="invalid-feedback d-block">{String(errors.description?.message)}</div>
                      )}
                    </Form.Group>

                    {/* Clean */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Cleanliness</Form.Label>
                      <select {...register('clean')} className="form-control">
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </select>
                    </Form.Group>

                    {/* Budget (increment/decrement by 100, also editable) */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Budget</Form.Label>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            const cur = Number(watch('budget')) || 0;
                            setValue('budget', Math.max(0, cur - 100), { shouldValidate: true, shouldDirty: true });
                          }}
                          aria-label="Decrease budget"
                          disabled={(Number(watch('budget')) || 0) <= 0}
                          style={{ borderRadius: 8 }}
                        >
                          -100
                        </button>

                        <input
                          type="number"
                          {...register('budget', { valueAsNumber: true })}
                          className="form-control"
                          style={{ width: 140, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)' }}
                          min={0}
                          onBlur={(e) => {
                            const n = Number((e.target as HTMLInputElement).value);
                            if (Number.isNaN(n)) {
                              setValue('budget', 0, { shouldValidate: true, shouldDirty: true });
                            } else {
                              setValue('budget', Math.max(0, n), { shouldValidate: true, shouldDirty: true });
                            }
                          }}
                        />

                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            const cur = Number(watch('budget')) || 0;
                            setValue('budget', cur + 100, { shouldValidate: true, shouldDirty: true });
                          }}
                          aria-label="Increase budget"
                          style={{ borderRadius: 8 }}
                        >
                          +100
                        </button>
                      </div>
                      <small className="text-muted">You can also type a number directly.</small>
                    </Form.Group>

                    {/* Social */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Social Life</Form.Label>
                      <select {...register('social')} className="form-control">
                        <option value="Introvert">Introvert</option>
                        <option value="Ambivert">Ambivert</option>
                        <option value="Extrovert">Extrovert</option>
                        <option value="Unsure">Unsure</option>
                      </select>
                    </Form.Group>

                    {/* Study */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Study Habits</Form.Label>
                      <select {...register('study')} className="form-control">
                        <option value="Cramming">Cramming</option>
                        <option value="Regular">Regular</option>
                        <option value="None">None</option>
                      </select>
                    </Form.Group>

                    {/* Sleep */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Sleep Schedule</Form.Label>
                      <select {...register('sleep')} className="form-control">
                        <option value="Early_Bird">Early Bird</option>
                        <option value="Night_Owl">Night Owl</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </Form.Group>
                  </Col>

                  {/* Image */}
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Profile Photo</Form.Label>
                      <div style={{ borderRadius: 8, padding: 10, border: '1px dashed #e6e9ee', background: '#fafafa' }}>
                        <ProfileImageUpload
                          initialUrl={null}
                          onUpload={(url) => setValue('image', url, { shouldValidate: true, shouldDirty: true })}
                        />
                      </div>
                      <input type="hidden" {...register('image')} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="pt-3">
                  <Col>
                    <Button type="submit" variant="primary" className="rounded-pill px-4" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create profile'}
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={() =>
                        reset({
                          userId: Number((session as any)?.user?.id ?? 0),
                          name: '',
                          description: '',
                          image: null,
                          clean: 'good',
                          budget: 0,
                          social: 'Unsure',
                          study: 'Regular',
                          sleep: 'Flexible',
                        })
                      }
                      className="rounded-pill"
                    >
                      Reset
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
