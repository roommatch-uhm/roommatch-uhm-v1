'use client';

import { useSession } from 'next-auth/react';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Image,
} from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { useRouter } from 'next/navigation';
import { createProfile } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CreateProfileSchema } from '@/lib/validationSchemas';
import ProfileImageUpload from '@/components/UploadImg';

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
    resolver: yupResolver(CreateProfileSchema),
    defaultValues: { image: null, budget: 0 },
  });

  const selectedImage = watch('image');
  const router = useRouter();

  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  // debug: show form errors in console (do not JSON.stringify — errors may contain circular refs)
  console.log('form errors (raw)', errors);
  // also produce a serializable summary of messages for easy inspection
  const serializableErrors = Object.keys(errors).reduce((acc: Record<string, any>, key) => {
    const e = (errors as any)[key];
    acc[key] = { message: e?.message ?? null };
    return acc;
  }, {});
  console.log('form errors (summary)', JSON.stringify(serializableErrors, null, 2));

  const onError = (errs: any) => {
    // Build a friendly message listing each invalid field and message
    const entries = Object.keys(errs).map((k) => {
      const m = (errs as any)[k]?.message ?? 'invalid';
      return `${k}: ${m}`;
    });
    const message = entries.length ? entries.join('\n') : 'Some required fields are missing or invalid.';
    console.log('Validation errors (onError):', errs, message);

    // Focus the first invalid field if present
    const firstKey = Object.keys(errs)[0];
    if (firstKey) {
      const el = document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null;
      if (el && typeof el.focus === 'function') el.focus();
    }

    // Show readable message to the user
    swal('Please fix form errors', message, 'error');
  };

  // ensure onSubmit is wired to the <Form> below and button is type="submit"

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log('onSubmit fired, data=', data);
    const userIdStr = (session?.user as any)?.id;
    if (!userIdStr) {
      swal('Error', 'You must be logged in', 'error');
      return;
    }

    try {
      const payload = {
        ...data,
        userId: parseInt(userIdStr, 10),
        budget: Number(data.budget) || 0,
        image: data.image ?? null,
      };

      console.log('Submitting profile payload:', payload);
      const created = await createProfile(payload);
      console.log('createProfile returned:', created);

      swal('Success', 'Your Profile has been saved', 'success', { timer: 1500 });
      router.push('/profile');
    } catch (err: any) {
      console.error('createProfile error', err);
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
                      <input
                        type="number"
                        {...register('budget', { valueAsNumber: true })}
                        className="form-control"
                      />
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
                  </Col>

                  {/* Image */}
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Profile Photo</Form.Label>
                      <ProfileImageUpload
                        onUpload={(url) =>
                          setValue('image', url, { shouldValidate: true, shouldDirty: true })
                        }
                      />
                      <input type="hidden" {...register('image')} />
                      {selectedImage && (
                        <div className="mt-2">
                          <Image
                            src={selectedImage}
                            alt="Profile"
                            rounded
                            style={{
                              maxWidth: '100%',
                              maxHeight: '200px',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="pt-3">
                  <Col>
                    <Button type="submit" variant="primary" onClick={() => console.log('Submit button clicked')}>
                      Submit
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="button"
                      variant="warning"
                      onClick={() => reset()}
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
