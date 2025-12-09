import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scoreProfilesForUser } from '@/lib/compatibility';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userIdParam = url.searchParams.get('userId');
    const userId = userIdParam ? Number(userIdParam) : NaN;
    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ error: 'userId query param required' }, { status: 400 });
    }

    const me = await prisma.profile.findUnique({ where: { userId } });
    if (!me) return NextResponse.json({ error: 'profile not found' }, { status: 404 });

    const others = await prisma.profile.findMany({ where: { userId: { not: userId } } });

    const results = scoreProfilesForUser(me, others);
    return NextResponse.json(results);
  } catch (err) {
    console.error('compat route error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}