

'use client';

import { useSession } from 'next-auth/react';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { useRouter } from 'next/navigation';
import { createProfile } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CreateProfileSchema } from '@/lib/validationSchemas';
import DealBreakers from '@/components/DealBreakers';
import React, { useRef, useState } from 'react';

type FormValues = {
  name: string;
  description: string;
  clean: 'excellent' | 'good' | 'fair' | 'poor';
  budget?: number | null;
  social: 'Introvert' | 'Ambivert' | 'Extrovert' | 'Unsure';
  study: 'Cramming' | 'Regular' | 'None';
  sleep: 'Early_Bird' | 'Night_Owl' | 'Flexible';
  dealbreakers?: (string | undefined)[] | null;
};

export default function CreateUserProfile() {
  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(CreateProfileSchema) as any,
    defaultValues: { budget: 0, dealbreakers: [] },
  });

  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dealbreakers, setDealbreakers] = useState<string[]>([]);

  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  // Update preview when user selects a new file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const onError = (errs: any) => {
    const entries = Object.keys(errs).map((k) => {
      const m = (errs as any)[k]?.message ?? 'invalid';
      return `${k}: ${m}`;
    });
    const message = entries.length ? entries.join('\n') : 'Some required fields are missing or invalid.';
    swal('Please fix form errors', message, 'error');
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const userIdStr = (session?.user as any)?.id;
    if (!userIdStr) {
      swal('Error', 'You must be logged in', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('clean', data.clean);
    formData.append('budget', String(data.budget ?? 0));
    formData.append('social', data.social);
    formData.append('study', data.study);
    formData.append('sleep', data.sleep);
    formData.append('userId', userIdStr);
    formData.append('dealbreakers', JSON.stringify(dealbreakers));

    if (fileInput.current?.files?.[0]) {
      formData.append('image', fileInput.current.files[0]);
    }

    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json(); // Expect { redirectTo: '/profile', ... }
      swal('Success', 'Your Profile has been saved', 'success', { timer: 1500 });
      // Force reload by adding a unique query string
      router.replace(`/profile?refresh=${Date.now()}`);
    } catch (err: any) {
      swal('Error', err?.message || 'Failed to create profile', 'error');
    }
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={500}>
          <h2 className="text-center">Create your Profile</h2>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit, onError)}>
                <Row>
                  <Col>
                    {/* Name */}
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <input
                        type="text"
                        {...register('name')}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      />
                      {errors.name && (
                        <div className="invalid-feedback d-block">
                          {String(errors.name?.message)}
                        </div>
                      )}
                    </Form.Group>

                    {/* Description */}
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <textarea
                        {...register('description')}
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      />
                      {errors.description && (
                        <div className="invalid-feedback d-block">
                          {String(errors.description?.message)}
                        </div>
                      )}
                    </Form.Group>

                    {/* Clean */}
                    <Form.Group className="mb-3">
                      <Form.Label>Cleanliness</Form.Label>
                      <select {...register('clean')} className="form-control">
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </select>
                    </Form.Group>

                    {/* Budget */}
                    <Form.Group className="mb-3">
                      <Form.Label>Budget</Form.Label>
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
                        >
                          -100
                        </button>

                        <input
                          type="number"
                          {...register('budget', { valueAsNumber: true })}
                          className="form-control d-inline-block"
                          style={{ width: 140, MozAppearance: 'textfield' }}
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
                        >
                          +100
                        </button>
                      </div>
                      <small className="text-muted">You can also type a number directly.</small>
                    </Form.Group>

                    {/* Social */}
                    <Form.Group className="mb-3">
                      <Form.Label>Social Life</Form.Label>
                      <select {...register('social')} className="form-control">
                        <option value="Introvert">Introvert</option>
                        <option value="Ambivert">Ambivert</option>
                        <option value="Extrovert">Extrovert</option>
                        <option value="Unsure">Unsure</option>
                      </select>
                    </Form.Group>

                    {/* Study */}
                    <Form.Group className="mb-3">
                      <Form.Label>Study Habits</Form.Label>
                      <select {...register('study')} className="form-control">
                        <option value="Cramming">Cramming</option>
                        <option value="Regular">Regular</option>
                        <option value="None">None</option>
                      </select>
                    </Form.Group>

                    {/* Sleep */}
                    <Form.Group className="mb-3">
                      <Form.Label>Sleep Schedule</Form.Label>
                      <select {...register('sleep')} className="form-control">
                        <option value="Early_Bird">Early Bird</option>
                        <option value="Night_Owl">Night Owl</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </Form.Group>

                    {/* Dealbreakers */}
                    <DealBreakers
                      selectedDealbreakers={dealbreakers}
                      onChange={setDealbreakers}
                    />
                  </Col>

                  {/* Image */}
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Profile Photo</Form.Label>
                      {previewUrl && (
                        <div className="mb-2">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: 500, borderRadius: 8 }}
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        ref={fileInput}
                        onChange={handleFileChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="pt-3">
                  <Col>
                    <Button type="submit" variant="primary">
                      Submit
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="button"
                      variant="warning"
                      onClick={() => {
                        reset();
                        setPreviewUrl(null);
                      }}
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
