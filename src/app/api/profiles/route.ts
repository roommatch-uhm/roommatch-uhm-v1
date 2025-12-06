import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

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

  let imageUrl: string | null = null;
  if (imageFile && (imageFile as any).size) {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `${Date.now()}-${((imageFile as any).name || 'upload').replace(/\s+/g, '-')}`;
    const dir = path.join(process.cwd(), 'public', 'images');
    await fs.promises.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, filename);
    await fs.promises.writeFile(filePath, buffer);
    imageUrl = `/images/${filename}`;
  }

  const name = (formData.get('name') as string) || '';
  const description = (formData.get('description') as string) || '';
  const clean = (formData.get('clean') as string) || '';
  const budget = formData.get('budget') ? Number(formData.get('budget')) : null;
  const social = (formData.get('social') as string) || '';
  const study = (formData.get('study') as string) || '';
  const sleep = (formData.get('sleep') as string) || '';
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
      imageUrl, // store URL path, not imageData
    },
  });

  return NextResponse.json({ success: true, imageUrl });
}