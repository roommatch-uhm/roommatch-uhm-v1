import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Profile } from '@prisma/client';

interface Params {
  id: string;
}

interface ErrorResponse {
  error: string;
}

export async function GET(req: Request, { params }: { params: Params }): Promise<NextResponse> {
  const profile = (await prisma.profile.findUnique({
    where: { id: Number(params.id) },
  })) as Profile | null;
  if (!profile) return NextResponse.json({ error: 'Not found' } as ErrorResponse, { status: 404 });
  return NextResponse.json(profile);
}

interface UpdateProfileData extends Partial<Profile> {}

export async function PUT(req: Request, { params }: { params: Params }): Promise<NextResponse> {
  const data = (await req.json()) as UpdateProfileData;
  const updated = await prisma.profile.update({
    where: { id: Number(params.id) },
    data,
  });
  return NextResponse.json(updated);
}