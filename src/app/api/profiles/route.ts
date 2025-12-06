
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Define the shape of the form data
type FormValues = {
  name: string;
  description: string;
  clean: string;
  social: string;
  study: string;
  sleep: string;
  budget?: number;
  imageData?: File | null;
};

// GET: List all profiles
export async function GET() {
  const profiles = await prisma.profile.findMany();
  return NextResponse.json(profiles);
}

// POST: Create a new profile
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const imageFile = formData.get('image') as File | null;

  let imageBuffer: Buffer | null = null;
  if (imageFile) {
    const arrayBuffer = await imageFile.arrayBuffer();
    imageBuffer = Buffer.from(arrayBuffer);
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const clean = formData.get('clean') as string;
  const budget = formData.get('budget') ? Number(formData.get('budget')) : null;
  const social = formData.get('social') as string;
  const study = formData.get('study') as string;
  const sleep = formData.get('sleep') as string;
  const userId = Number(formData.get('userId'));

  await prisma.profile.create({
    data: {
      userId,
      name,
      description,
      clean,
      budget,
      social,
      study,
      sleep,
      imageData: imageBuffer, // <-- Now a Buffer!
    },
  });

  return NextResponse.json({ success: true });
}
