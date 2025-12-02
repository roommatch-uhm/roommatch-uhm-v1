import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET: Search users by email pattern for test cleanup
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const emailPattern = searchParams.get('emailPattern');
  if (!emailPattern) return NextResponse.json([], { status: 400 });

  const users = await prisma.user.findMany({
    where: {
      UHemail: { contains: emailPattern },
    },
  });
  return NextResponse.json(users);
}

// POST: Create a new user
export async function POST(req: Request) {
  try {
    const data = await req.json();
    // No password hashing
    const user = await prisma.user.create({ data });
    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
