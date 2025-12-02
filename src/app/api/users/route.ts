import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
  const data = await req.json();
  // Hash password if needed (uncomment if your auth expects it)
  // import bcrypt from 'bcryptjs';
  // if (data.password) {
  //   data.password = await bcrypt.hash(data.password, 10);
  // }
  const user = await prisma.user.create({ data });
  return NextResponse.json(user);
}
