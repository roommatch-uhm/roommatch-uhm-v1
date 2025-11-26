import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch all meetings for a user (expects userId in query string)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get('userId'));
  if (!userId) return NextResponse.json([], { status: 400 });
  const meetings = await prisma.meeting.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
  });
  return NextResponse.json(meetings);
}

// POST: Create a new meeting
export async function POST(req: Request) {
  const { userId, title, date, time } = await req.json();
  if (!userId || !title || !date || !time) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const meeting = await prisma.meeting.create({
    data: {
      userId,
      title,
      date: new Date(date),
      time,
    },
  });
  return NextResponse.json(meeting);
}