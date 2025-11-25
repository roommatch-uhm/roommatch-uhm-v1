import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Meeting } from '@prisma/client';

// Get a specific meeting by ID
interface Params { id: string }
interface ErrorResponse { error: string }
interface SuccessResponse { success: true }
type MeetingUpdateData = Partial<Omit<Meeting, 'id'>>;

// Get a specific meeting by ID
export async function GET(req: Request, { params }: { params: Params }): Promise<NextResponse<Meeting | ErrorResponse>> {
  const meeting: Meeting | null = await prisma.meeting.findUnique({
    where: { id: Number(params.id) },
  });
  if (!meeting) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(meeting);
}

// Update a meeting by ID
export async function PUT(req: Request, { params }: { params: Params }): Promise<NextResponse<Meeting>> {
  const data: MeetingUpdateData = await req.json();
  const updated: Meeting = await prisma.meeting.update({
    where: { id: Number(params.id) },
    data,
  });
  return NextResponse.json(updated);
}

// Delete a meeting by ID
export async function DELETE(req: Request, { params }: { params: Params }): Promise<NextResponse<SuccessResponse>> {
  await prisma.meeting.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ success: true });
}

