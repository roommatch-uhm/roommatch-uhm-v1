import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: List all profiles
export async function GET() {
  const profiles = await prisma.profile.findMany();
  return NextResponse.json(profiles);
}

// POST: Create a new profile
export async function POST(req: Request) {
  const data = await req.json();
  const profile = await prisma.profile.create({ data });
  return NextResponse.json(profile);
}