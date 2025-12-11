import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Profile } from '@prisma/client';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const url = new URL(req.url);
  const userIdQuery = url.searchParams.get('userId');

  console.log('Incoming request to /api/profiles/:id');
  console.log('  raw path param id:', params.id);
  console.log('  userId query param:', userIdQuery);

  const profile: Profile | null = userIdQuery
    ? await prisma.profile.findUnique({ where: { userId: Number(userIdQuery) } })
    : await prisma.profile.findUnique({ where: { id: Number(params.id) } });

  // Additional terminal debug: show which record was returned (or none)
  if (profile) {
    console.log(
      `Resolved profile -> profile.id: ${profile.id}, profile.userId: ${profile.userId}, profile.name: ${profile.name}`
    );
  } else {
    console.log('No profile found for provided identifier(s).');
  }

  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const formData = await req.formData();
  const imageFile = formData.get('image') as File | null;
  let imageBuffer: Buffer | null = null;
  if (imageFile) {
    imageBuffer = Buffer.from(await imageFile.arrayBuffer());
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const clean = formData.get('clean') as string;
  const budget = formData.get('budget') ? Number(formData.get('budget')) : null;
  const social = formData.get('social') as string;
  const study = formData.get('study') as string;
  const sleep = formData.get('sleep') as string;
  const userId = Number(formData.get('userId'));

  const data: any = {
    user: { connect: { id: userId } },
    name,
    description,
    clean,
    budget,
    social,
    study,
    sleep,
  };
  if (imageBuffer) {
    data.imageData = imageBuffer;
    data.imageAddedAt = new Date();
  }

  try {
    const updated = await prisma.profile.update({
      where: { id: Number(params.id) },
      data,
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
