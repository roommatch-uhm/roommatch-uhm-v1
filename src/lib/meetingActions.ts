import { prisma } from '@/lib/prisma';

// Add a meeting for a user
export async function addMeeting(userId: number, title: string, date: string, time: string) {
  return prisma.meeting.create({
    data: {
      userId,
      title,
      date: new Date(date),
      time,
    },
  });
}

// Get all meetings for a user
export async function getMeetings(userId: number) {
  return prisma.meeting.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
  });
}

// Delete a meeting (cancel)
export async function deleteMeeting(meetingId: number, userId: number) {
  // Only allow delete if meeting belongs to user
  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting || meeting.userId !== userId) throw new Error('Unauthorized');
  return prisma.meeting.delete({ where: { id: meetingId } });
}
