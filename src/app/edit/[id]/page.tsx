'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Container, Form, Button } from 'react-bootstrap';
import { Profile } from '@prisma/client';

const EditProfilePage = () => {
  const router = useRouter();
  const params = useParams();
  const profileId = params.id;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clean, setClean] = useState('');
  const [budget, setBudget] = useState(0);
  const [social, setSocial] = useState('');
  const [study, setStudy] = useState('');
  const [sleep, setSleep] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch(`/api/profiles/${profileId}`);
      const data: Profile = await res.json();
      setProfile(data);
      setName(data.name);
      setDescription(data.description);
      setClean(data.clean);
      setBudget(data.budget);
      setSocial(data.social);
      setStudy(data.study);
      setSleep(data.sleep);
      setImage(data.image ?? "");
      setLoading(false);
    }

    fetchProfile();
  }, [profileId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/profiles/${profileId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        clean,
        budget,
        social,
        study,
        sleep,
        image,
      }),
    });

    if (res.ok) {
      router.push('/profile'); // redirect back to profile page
    } else {
      alert('Failed to update profile');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Container className="py-4">
      <h1>Edit Profile</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cleanliness</Form.Label>
          <Form.Control
            value={clean}
            onChange={(e) => setClean(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Budget</Form.Label>
          <Form.Control
            type="number"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value))}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Social</Form.Label>
          <Form.Control
            value={social}
            onChange={(e) => setSocial(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Study</Form.Label>
          <Form.Control
            value={study}
            onChange={(e) => setStudy(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Sleep</Form.Label>
          <Form.Control
            value={sleep}
            onChange={(e) => setSleep(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </Form.Group>

        <Button type="submit">Save Changes</Button>
      </Form>
    </Container>
  );
};

export default EditProfilePage;
