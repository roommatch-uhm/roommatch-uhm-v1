'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { EditProfileSchema } from '@/lib/validationSchemas';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Profile } from '@prisma/client';

type FormValues = {
  name: string;
  description: string;
  clean: 'excellent' | 'good' | 'fair' | 'poor';
  budget?: number | null;
  social: 'Introvert' | 'Ambivert' | 'Extrovert' | 'Unsure';
  study: 'Cramming' | 'Regular' | 'None';
  sleep: 'Early_Bird' | 'Night_Owl' | 'Flexible';
};

export default function EditProfileForm({ profile }: { profile: Profile }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profile.imageData
      ? `/api/profiles/${profile.id}/image`
      : null
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(EditProfileSchema),
    defaultValues: {
      name: profile?.name ?? '',
      description: profile?.description ?? '',
      clean: (profile?.clean as any) ?? 'good',
      budget: profile?.budget ?? 0,
      social: (profile?.social as any) ?? 'Unsure',
      study: (profile?.study as any) ?? 'Regular',
      sleep: (profile?.sleep as any) ?? 'Flexible',
    },
  });

  useEffect(() => {
    reset({
      name: profile?.name ?? '',
      description: profile?.description ?? '',
      clean: (profile?.clean as any) ?? 'good',
      budget: profile?.budget ?? 0,
      social: (profile?.social as any) ?? 'Unsure',
      study: (profile?.study as any) ?? 'Regular',
      sleep: (profile?.sleep as any) ?? 'Flexible',
    });
  }, [profile, reset]);

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
      setPreviewUrl(profile.imageData ? `/api/profiles/${profile.id}/image` : null);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('clean', data.clean);
      formData.append('budget', String(data.budget ?? 0));
      formData.append('social', data.social);
      formData.append('study', data.study);
      formData.append('sleep', data.sleep);
      formData.append('userId', String(profile.userId));

      // Append file if selected
      if (fileInput.current?.files?.[0]) {
        formData.append('image', fileInput.current.files[0]);
      }

      const res = await fetch(`/api/profiles/${profile.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      swal('Success', 'Profile updated', 'success', { timer: 1200 });

      // Force reload by adding a unique query string
      router.replace(`/profile?refresh=${Date.now()}`);
    } catch (err: any) {
      console.error('editProfile error', err);
      swal('Error', err?.message || 'Failed to update profile', 'error');
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow" style={{ borderRadius: 14, overflow: 'hidden' }}>
            <div
              style={{
                background: 'linear-gradient(90deg, rgba(37,117,252,0.12), rgba(106,17,203,0.08))',
                padding: '18px 22px',
                borderBottom: '1px solid rgba(0,0,0,0.03)',
              }}
            >
              <h2 style={{ margin: 0, fontWeight: 700 }}>Edit your Profile</h2>
              <div style={{ color: '#666', marginTop: 6 }}>Update your details and photo</div>
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
                        name="name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)' }}
                      />
                      {errors.name && (
                        <div className="invalid-feedback d-block">
                          {String(errors.name?.message)}
                        </div>
                      )}
                    </Form.Group>

                    {/* Description */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Description</Form.Label>
                      <textarea
                        {...register('description')}
                        name="description"
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        rows={4}
                        style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)' }}
                      />
                      {errors.description && (
                        <div className="invalid-feedback d-block">
                          {String(errors.description?.message)}
                        </div>
                      )}
                    </Form.Group>

                    {/* Clean */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Cleanliness</Form.Label>
                      <select {...register('clean')} name="clean" className="form-control">
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </select>
                    </Form.Group>

                    {/* Budget */}
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
                        >
                          -100
                        </button>

                        <input
                          type="number"
                          {...register('budget', { valueAsNumber: true })}
                          name="budget"
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
                      <Form.Label className="fw-semibold">Social Life</Form.Label>
                      <select {...register('social')} name="social" className="form-control">
                        <option value="Introvert">Introvert</option>
                        <option value="Ambivert">Ambivert</option>
                        <option value="Extrovert">Extrovert</option>
                        <option value="Unsure">Unsure</option>
                      </select>
                    </Form.Group>

                    {/* Study */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Study Habits</Form.Label>
                      <select {...register('study')} name="study" className="form-control">
                        <option value="Cramming">Cramming</option>
                        <option value="Regular">Regular</option>
                        <option value="None">None</option>
                      </select>
                    </Form.Group>

                    {/* Sleep */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Sleep Schedule</Form.Label>
                      <select {...register('sleep')} name="sleep" className="form-control">
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
                      {previewUrl && (
                        <div className="mb-2">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8 }}
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
                    <Button type="submit" variant="primary" className="rounded-pill px-4">
                      Save changes
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={() => {
                        reset({
                          name: profile.name,
                          description: profile.description,
                          clean: profile.clean as any,
                          budget: profile.budget ?? 0,
                          social: profile.social as any,
                          study: profile.study as any,
                          sleep: profile.sleep as any,
                        });
                        setPreviewUrl(profile.imageData ? `/api/profiles/${profile.id}/image` : null);
                      }}
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
