'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Alert, Spinner } from 'react-bootstrap';
import RoommateCard from '@/components/RoommateCard';
import { Profile } from '@prisma/client';
import { calculateCompatibility } from '@/lib/compatibility';
import { useSession } from 'next-auth/react';
import { useRouter} from 'next/navigation';

interface RoommateDirectoryProps {
  profiles: Profile[];
  currentUserProfile: Profile;
}

const RoommateDirectory: React.FC<RoommateDirectoryProps> = ({
  profiles,
  currentUserProfile,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [socialFilter, setSocialFilter] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (!session) {
    return null; // avoid flicker before redirect
  }

  if (!currentUserProfile) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          You don’t have a profile yet. Please{' '}
          <a href="/auth/signup" className="fw-bold text-decoration-none text-success">
            create your profile
          </a>{' '}
          to see your roommate matches.
        </Alert>
      </Container>
    );
  }
  
  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesBudget =
      budgetFilter
        ? p.budget !== null && p.budget !== undefined && p.budget.toString() === budgetFilter
        : true;
    const matchesSocial = socialFilter ? p.social.includes(socialFilter) : true;
    return matchesSearch && matchesBudget && matchesSocial;
  });

  // Sort by compatibility (highest first)
  const sortedProfiles = [...filteredProfiles].sort(
    (a, b) =>
      calculateCompatibility(currentUserProfile, b) -
      calculateCompatibility(currentUserProfile, a)
  );

  return (
    <Container className="py-4">
      <h1 className="mb-4">Roommate Listings</h1>

      {/* Filters */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Search by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
          >
            <option value="">All Budgets</option>
            <option value="500">500</option>
            <option value="800">800</option>
            <option value="1000">1000</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select
            value={socialFilter}
            onChange={(e) => setSocialFilter(e.target.value)}
          >
            <option value="">All Social Types</option>
            <option value="Introvert">Introvert</option>
            <option value="Extrovert">Extrovert</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Cards */}
      <Row xs={1} md={2} className="g-3">
        {sortedProfiles.map((profile) => (
          <Col key={profile.id}>
            <RoommateCard profile={profile} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RoommateDirectory;
