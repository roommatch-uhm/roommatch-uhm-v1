'use client';
import React, { useEffect, useState } from 'react';

type MatchRow = { profileId: number; userId: number; name?: string | null; score: number };

export default function MatchesCompatibility({ currentUserId }: { currentUserId: number | null }) {
  const [matches, setMatches] = useState<MatchRow[] | null>(null);

  useEffect(() => {
    if (!currentUserId) return;
    fetch(`/api/compatibility?userId=${currentUserId}`)
      .then((r) => r.json())
      .then((data: any) => setMatches(Array.isArray(data) ? data : []))
      .catch((e) => {
        console.error('compat fetch', e);
        setMatches([]);
      });
  }, [currentUserId]);

  if (!currentUserId) return <div>Please sign in to see matches.</div>;
  if (matches === null) return <div>Loading matches…</div>;
  if (matches.length === 0) return <div>No matches found</div>;

  return (
    <div>
      <h3>Matches (by compatibility)</h3>
      <ul>
        {matches.map((m) => (
          <li key={m.profileId}>
            <strong>{m.name ?? `Profile ${m.profileId}`}</strong> — {Math.round(m.score)}% compatible
          </li>
        ))}
      </ul>
    </div>
  );
}
