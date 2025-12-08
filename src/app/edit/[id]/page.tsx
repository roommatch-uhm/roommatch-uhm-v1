import React from 'react';
import EditProfileForm from '@/components/EditProfile';
import { getProfileById } from '@/lib/dbActions';

export default async function EditProfilePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return <p>Invalid profile id</p>;
  }

  const profile = await getProfileById(id);

  if (!profile) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Profile not found</h2>
        <p>The requested profile does not exist.</p>
      </div>
    );
  }

  return <EditProfileForm profile={profile} />;
}
