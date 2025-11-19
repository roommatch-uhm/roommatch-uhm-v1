'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import RoommateCard from '@/components/RoommateCard';
import { Profile } from '@prisma/client';

const RoommateDirectory: React.FC<{ profiles: Profile[] }> = ({ profiles }) => {
  const [search, setSearch] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [socialFilter, setSocialFilter] = useState('');

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesBudget = budgetFilter
      ? p.budget.toString() === budgetFilter
      : true;
    const matchesSocial = socialFilter ? p.social.includes(socialFilter) : true;
    return matchesSearch && matchesBudget && matchesSocial;
  });

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
        {filteredProfiles.map((profile) => (
          <Col key={profile.id}>
            <RoommateCard profile={profile} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RoommateDirectory;
