'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Container, Row, Col, Form, Alert, Spinner, Button, Dropdown } from 'react-bootstrap';
import RoommateCard from '@/components/RoommateCard';
import { Profile } from '@prisma/client';
import { calculateCompatibility } from '@/lib/compatibility';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface RoommateDirectoryProps {
  profiles: Profile[];
  currentUserProfile?: Profile; // <-- allow undefined
}

const SOCIAL_OPTIONS = ['Introvert', 'Ambivert', 'Extrovert', 'Unsure'] as const;

/* New dual-handle slider component */
const DualRange: React.FC<{
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}> = ({ min, max, step = 100, value: [low, high], onChange }) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef<'low' | 'high' | null>(null);

  const valueToPercent = (val: number) => {
    if (max === min) return 0;
    return ((val - min) / (max - min)) * 100;
  };

  const clamp = (v: number, a = min, b = max) => Math.min(Math.max(v, a), b);

  const snap = (raw: number) => {
    const snapped = Math.round(raw / step) * step;
    return snapped;
  };

  const pointerMove = (clientX: number) => {
    const track = trackRef.current;
    if (!track || !draggingRef.current) return;
    const rect = track.getBoundingClientRect();
    const px = clamp(clientX, rect.left, rect.right) - rect.left;
    const ratio = rect.width > 0 ? px / rect.width : 0;
    const rawValue = min + ratio * (max - min);
    const snapped = clamp(snap(rawValue));
    if (draggingRef.current === 'low') {
      const newLow = Math.min(snapped, high); // ensure low <= high
      onChange([newLow, high]);
    } else {
      const newHigh = Math.max(snapped, low); // ensure high >= low
      onChange([low, newHigh]);
    }
  };

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => pointerMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => pointerMove(e.touches[0].clientX);
    const onPointerUp = () => {
      draggingRef.current = null;
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
    };
  }, [low, high, min, max, step, onChange]);

  const startDrag = (which: 'low' | 'high', e: React.PointerEvent | React.MouseEvent | React.TouchEvent) => {
    draggingRef.current = which;

    // handle immediate move to pointer location
    const clientX =
      'touches' in (e as any) ? (e as any).touches[0]?.clientX ?? 0 : (e as any).clientX ?? 0;
    if (clientX) pointerMove(clientX as number);
  };

  return (
    <div style={{ position: 'relative', padding: '10px 0' }}>
      <div
        ref={trackRef}
        style={{
          height: 10,
          borderRadius: 999,
          background: 'linear-gradient(90deg,#e6f0ff,#f0f9ff)',
          position: 'relative',
          border: '1px solid rgba(37,99,235,0.08)',
        }}
      >
        {/* active range fill */}
        <div
          style={{
            position: 'absolute',
            left: `${valueToPercent(low)}%`,
            right: `${100 - valueToPercent(high)}%`,
            top: 0,
            bottom: 0,
            borderRadius: 999,
            background: 'linear-gradient(90deg,#93c5fd,#3b82f6)',
            boxShadow: 'inset 0 -3px 8px rgba(59,130,246,0.12)',
          }}
        />

        {/* low handle */}
        <div
          role="slider"
          aria-label="Minimum budget"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={low}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onChange([clamp(snap(low - step)), high]);
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onChange([clamp(snap(low + step)), high]);
          }}
          onPointerDown={(e) => startDrag('low', e)}
          style={{
            position: 'absolute',
            left: `calc(${valueToPercent(low)}% - 12px)`,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 24,
            height: 24,
            borderRadius: 12,
            background: '#fff',
            border: '3px solid #3b82f6',
            boxShadow: '0 6px 18px rgba(59,130,246,0.16)',
            cursor: 'grab',
            zIndex: 4,
          }}
        />

        {/* high handle */}
        <div
          role="slider"
          aria-label="Maximum budget"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={high}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onChange([low, clamp(snap(high - step))]);
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onChange([low, clamp(snap(high + step))]);
          }}
          onPointerDown={(e) => startDrag('high', e)}
          style={{
            position: 'absolute',
            left: `calc(${valueToPercent(high)}% - 12px)`,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 24,
            height: 24,
            borderRadius: 12,
            background: '#fff',
            border: '3px solid #3b82f6',
            boxShadow: '0 6px 18px rgba(59,130,246,0.16)',
            cursor: 'grab',
            zIndex: 4,
          }}
        />
      </div>
    </div>
  );
};
/* end DualRange */

const RoommateDirectory: React.FC<RoommateDirectoryProps> = ({
  profiles,
  currentUserProfile,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [socialFilter, setSocialFilter] = useState<string[]>([]);
  const [socialOpen, setSocialOpen] = useState(false);

  // track small viewport to adjust dropdown alignment
  const [isSmallViewport, setIsSmallViewport] = useState<boolean>(false);
  useEffect(() => {
    const update = () => setIsSmallViewport(typeof window !== 'undefined' ? window.innerWidth <= 767 : false);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // derive budget bounds from available profiles
  const { minAvailable, maxAvailable } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const p of profiles) {
      if (typeof p.budget === 'number' && !Number.isNaN(p.budget)) {
        min = Math.min(min, p.budget);
        max = Math.max(max, p.budget);
      }
    }
    if (min === Infinity || max === -Infinity) {
      // fallback bounds
      return { minAvailable: 0, maxAvailable: 2000 };
    }
    // round to reasonable steps
    const floor = Math.floor(min / 100) * 100;
    const ceil = Math.ceil(max / 100) * 100;
    // guard equal bounds
    return { minAvailable: Math.max(0, floor), maxAvailable: Math.max(ceil, floor + 100) };
  }, [profiles]);

  // slider state (start at full range)
  const [minBudget, setMinBudget] = useState<number>(minAvailable);
  const [maxBudget, setMaxBudget] = useState<number>(maxAvailable);

  // reset slider when profile list or available bounds change
  useEffect(() => {
    setMinBudget(minAvailable);
    setMaxBudget(maxAvailable);
  }, [minAvailable, maxAvailable]);

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

  // helper to toggle a social option
  const toggleSocial = (value: string) => {
    setSocialFilter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  // apply filters: search + budget range + social (multi-select)
  const filteredProfiles = profiles.filter(
    (p) => !currentUserProfile || p.userId !== currentUserProfile.userId
  )
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());

      const budgetFilterActive = !(minBudget === minAvailable && maxBudget === maxAvailable);

      const matchesBudget = budgetFilterActive
        ? typeof p.budget === 'number' && p.budget >= minBudget && p.budget <= maxBudget
        : true;

      const matchesSocial = socialFilter.length ? socialFilter.includes(p.social) : true;

      return matchesSearch && matchesBudget && matchesSocial;
    });

  // Sort by compatibility (highest first)
  // convert Date fields to strings for the compatibility util (ProfileAnswers expects string|number|null)
  const currentForCompat = {
    ...currentUserProfile,
    imageAddedAt: currentUserProfile.imageAddedAt ? currentUserProfile.imageAddedAt.toISOString() : null,
  } as any;

  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    const aForCompat = { ...a, imageAddedAt: a.imageAddedAt ? a.imageAddedAt.toISOString() : null } as any;
    const bForCompat = { ...b, imageAddedAt: b.imageAddedAt ? b.imageAddedAt.toISOString() : null } as any;
    return calculateCompatibility(currentForCompat, bForCompat) - calculateCompatibility(currentForCompat, aForCompat);
  });

  console.log('Current user profile userId:', currentUserProfile.userId);
  console.log('All profile userIds:', profiles.map(p => p.userId));

  return (
    <Container className="py-4">
      <h1 className="mb-4">Roommate Listings</h1>

      {/* Filters container with a tasteful blue tint */}
      <div className="filters-wrap" style={{
          background: 'linear-gradient(180deg,#f8fbff,#ffffff)',
          border: '1px solid rgba(59,130,246,0.12)',
          borderRadius: 12,
          padding: 14,
          marginBottom: 18,
          boxShadow: '0 8px 22px rgba(59,130,246,0.04)',
        }}>
        <style>{`
          .filters-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
          .filters-row > .col { padding-left: 0; padding-right: 0; }
          .search-col { min-width: 220px; flex: 1 1 240px; }
          .budget-col { flex: 2 1 420px; min-width: 280px; }
          .social-col { min-width: 200px; flex: 1 1 220px; display: flex; justify-content: flex-end; }
          .budget-controls { display: flex; gap: 12px; align-items: center; width: 100%; }
          .budget-controls .dual-range-wrap { flex: 1; }
          .reset-wrap { margin-left: 12px; }
          .dropdown-menu.custom-social { min-width: 240px; max-height: 300px; overflow-y: auto; padding: 12px 20px 18px 22px; box-sizing: border-box; }

          @media (max-width: 767px) {
            .filters-wrap { padding: 10px; }
            .filters-row { flex-direction: column; align-items: stretch; gap: 10px; }
            .search-col, .budget-col, .social-col { min-width: 0; flex: 1 1 100%; }
            .social-col { justify-content: flex-start; }
            .budget-controls { flex-direction: column; align-items: stretch; gap: 8px; }
            .reset-wrap { margin-left: 0; margin-top: 6px; display: flex; justify-content: flex-start; }
            .dropdown-menu.custom-social { left: 0 !important; right: auto !important; width: calc(100% - 8px); min-width: 0; }
            .dropdown-toggle.no-caret { width: 100%; justify-content: space-between; }
          }
        `}</style>

        <Row className="filters-row">
          <Col md={4} className="mb-2 search-col">
            {/* search with subtle blue accent and icon */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 10,
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  color: '#2563eb',
                }}
                aria-hidden
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-4.35-4.35" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="11" cy="11" r="6" stroke="#2563eb" strokeWidth="1.6" />
                </svg>
              </div>

              <Form.Control
                placeholder="Search by name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search by name or description"
                style={{
                  borderRadius: 10,
                  border: '1px solid rgba(59,130,246,0.16)',
                  boxShadow: 'inset 0 1px 2px rgba(59,130,246,0.02)',
                  padding: '10px 12px 10px 38px',
                  background: 'linear-gradient(180deg,#fff,#f7fbff)',
                }}
              />
            </div>
          </Col>

          <Col md={5} className="mb-2 budget-col">
            <div className="budget-controls">
              <div style={{ width: 140 }}>
                <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 600 }}>Budget range</div>
                <div style={{ fontSize: 13, color: '#475569', marginTop: 8 }}>
                  ${minBudget} — ${maxBudget}
                </div>
              </div>

              <div className="dual-range-wrap" style={{ flex: 1 }}>
                <DualRange
                  min={minAvailable}
                  max={maxAvailable}
                  step={100}
                  value={[minBudget, maxBudget]}
                  onChange={([newMin, newMax]) => {
                    setMinBudget(newMin);
                    setMaxBudget(newMax);
                  }}
                />
              </div>

              <div className="reset-wrap">
                 <Button
                   variant="outline-primary"
                   size="sm"
                   onClick={() => {
                     setMinBudget(minAvailable);
                     setMaxBudget(maxAvailable);
                   }}
                 >
                   Reset
                 </Button>
               </div>
            </div>
          </Col>

          <Col md={3} className="mb-2 social-col">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 99, background: '#3b82f6', boxShadow: '0 4px 10px rgba(59,130,246,0.14)' }} />
                <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 500 }}>Social filter</div>
              </div>

              {/* hide default caret on the Bootstrap toggle to keep a single caret */}
              <style>{`.no-caret::after{display:none !important}`}</style>

              <Dropdown show={socialOpen} onToggle={(isOpen) => setSocialOpen(isOpen)} align={isSmallViewport ? 'start' : 'end'}>
                <Dropdown.Toggle
                  as="div"
                  id="dropdown-social"
                  className="no-caret"
                  role="button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid rgba(59,130,246,0.18)',
                    background: socialFilter.length ? 'linear-gradient(90deg,#dbeafe,#bfdbfe)' : 'linear-gradient(90deg,#ffffff,#f0f8ff)',
                    color: '#0f172a',
                    fontWeight: 400,
                    minWidth: 180,
                    boxShadow: socialFilter.length ? '0 6px 18px rgba(59,130,246,0.06)' : '0 4px 10px rgba(2,6,23,0.03)',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ opacity: 0.95 }}>
                    {socialFilter.length ? `${socialFilter.length} selected` : 'Select social types'}
                  </span>

                  {/* single caret placed at right edge */}
                  <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M6 9l6 6 6-6" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="custom-social"
                  style={{
                    minWidth: 240,
                    background: 'linear-gradient(180deg,#f8fbff,#ffffff)',
                    borderRadius: 8,
                    border: '1px solid rgba(59,130,246,0.06)',
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                    zIndex: 1050,
                    paddingLeft: 22,
                    paddingRight: 20,
                    paddingTop: 12,
                    paddingBottom: 18,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingRight: 6 }}>
                    <strong style={{ fontSize: 13 }}>Filter</strong>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setSocialFilter([])}
                      style={{ textDecoration: 'none', padding: 0 }}
                    >
                      Clear
                    </Button>
                  </div>

                  {SOCIAL_OPTIONS.map((opt) => (
                    <div key={opt} style={{ marginBottom: 6 }}>
                      <Form.Check
                        type="checkbox"
                        id={`social-${opt}`}
                        label={opt}
                        checked={socialFilter.includes(opt)}
                        onChange={() => toggleSocial(opt)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '6px 8px',
                          borderRadius: 6,
                          background: socialFilter.includes(opt) ? 'rgba(59,130,246,0.06)' : 'transparent',
                          boxSizing: 'border-box',
                          whiteSpace: 'normal',
                          overflowWrap: 'break-word',
                          width: '100%',
                        }}
                      />
                    </div>
                  ))}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, paddingBottom: 8 }}>
                    <Button size="sm" variant="primary" onClick={() => setSocialOpen(false)} style={{ padding: '6px 10px' }}>
                      Done
                    </Button>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </div>

      {/* Cards */}
      <Row xs={1} md={2} className="g-3">
        {sortedProfiles.map((profile) => (
          <Col key={profile.id}>
            <RoommateCard profile={profile} />
          </Col>
        ))}
      </Row>

      {sortedProfiles.length === 0 && (
        <div className="text-center mt-4" style={{ color: '#6b7280' }}>
          No profiles match the selected filters.
        </div>
      )}
    </Container>
  );
};

export default RoommateDirectory;
