
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE: Delete profile(s) by userId
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const userId = Number(url.pathname.split('/').pop());
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  // Delete all profiles for this user
  await prisma.profile.deleteMany({ where: { userId } });
  return NextResponse.json({ success: true });
}
