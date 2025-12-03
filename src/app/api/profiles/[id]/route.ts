import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';
import type { Profile } from '@prisma/client';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const profile: Profile | null = await prisma.profile.findUnique({
    where: { id: Number(params.id) },
  });
  // Use imageUrl, not image (your schema uses imageUrl)
  console.log('API returning profile:', profile?.name, 'imageUrl:', profile?.imageUrl);
  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(profile);
}

interface PutRouteParams {
  params: {
    id: string;
  };
}

interface UpdateProfileData extends Partial<Omit<Profile, 'id'>> {}

export async function PUT(req: NextRequest, { params }: PutRouteParams): Promise<NextResponse> {
  const data: UpdateProfileData = await req.json();
  const updated = await prisma.profile.update({
    where: { id: Number(params.id) },
    data,
  });
  return NextResponse.json(updated);
}