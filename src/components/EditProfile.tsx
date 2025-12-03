'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { EditProfileSchema } from '@/lib/validationSchemas';
import { editProfile } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProfileImageUpload from '@/components/UploadImg';
import type { Profile } from '@prisma/client';

type FormValues = {
  name: string;
  description: string;
  image?: string | null;
  clean: 'excellent' | 'good' | 'fair' | 'poor';
  budget?: number | null;
  social: 'Introvert' | 'Ambivert' | 'Extrovert' | 'Unsure';
  study: 'Cramming' | 'Regular' | 'None';
  sleep: 'Early_Bird' | 'Night_Owl' | 'Flexible';
};

export default function EditProfileForm({ profile }: { profile: Profile }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  // normalize stored image path to ensure a usable URL (leading slash)
  const normalizeImageUrl = (img?: string | null) => {
    if (!img) return '/uploads/default.jpg';
    let src = img;
    if (src.startsWith('public/')) src = src.replace(/^public\//, '');
    if (!src.startsWith('/') && !/^https?:\/\//.test(src)) src = `/${src}`;
    return src;
  };

  const initialImageUrl = normalizeImageUrl(profile?.imageUrl ?? null);

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
      image: profile?.imageUrl ?? null,
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
      image: profile?.imageUrl ?? null,
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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        image: data.image ?? null,
        clean: data.clean,
        budget: Number(data.budget) || 0,
        social: data.social,
        study: data.study,
        sleep: data.sleep,
      };

      console.log('Editing profile', profile.id, payload);
      const updated = await editProfile(profile.id, payload);
      console.log('editProfile returned', updated);

      swal('Success', 'Profile updated', 'success', { timer: 1200 });
      router.push('/profile');
    } catch (err: any) {
      console.error('editProfile error', err);
      swal('Error', err?.message || 'Failed to update profile', 'error');
    }
  };

  // handler: upload to your server route which writes to Supabase and updates Prisma
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const userId = (session as any)?.user?.id;
    if (!file || !userId) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('userId', String(userId));
      const res = await fetch('/api/uploadProfileImage', { method: 'POST', body: fd });
      const json = await res.json();
      if (res.ok && json?.profile) {
        // optionally navigate or refresh
        router.refresh();
      } else {
        console.error('upload failed', json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
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

                    {/* Budget (increment/decrement by 100, never negative; also editable) */}
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
                      <div style={{ borderRadius: 8, padding: 10, border: '1px dashed #e6e9ee', background: '#fafafa' }}>
                        <ProfileImageUpload
                          initialUrl={initialImageUrl}
                          onUpload={(url) =>
                            setValue('image', url, { shouldValidate: true, shouldDirty: true })
                          }
                        />
                      </div>
                      <input type="hidden" {...register('image')} />
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
                      onClick={() =>
                        reset({
                          name: profile.name,
                          description: profile.description,
                          image: profile.imageUrl ?? null,
                          clean: profile.clean as any,
                          budget: profile.budget ?? 0,
                          social: profile.social as any,
                          study: profile.study as any,
                          sleep: profile.sleep as any,
                        })
                      }
                      className="rounded-pill"
                    >
                      Reset
                    </Button>
                  </Col>
                </Row>
              </Form>

              {/* File input handled by the ProfileImageUpload component above */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}