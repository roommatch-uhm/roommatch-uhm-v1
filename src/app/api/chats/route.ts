import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to attach profile name to members
async function attachProfileNames<T extends { id: number }>(members: T[]): Promise<(T & { profileName: string })[]> {
  return Promise.all(
    members.map(async (member) => {
      const profile = await prisma.profile.findFirst({ where: { userId: member.id } });
      console.log('Profile lookup:', { userId: member.id, profileName: profile?.name });
      return {
        ...member,
        profileName: profile?.name || '',
      } as T & { profileName: string };
    })
  );
}

// Create a new chat between two users (only if it doesn't exist)
export async function POST(req: Request) {
  const { userId1, userId2 } = await req.json();

  // Fetch user profiles for logging
  const profile1 = await prisma.profile.findFirst({ where: { userId: userId1 } });
  const profile2 = await prisma.profile.findFirst({ where: { userId: userId2 } });

  console.log(
    `Trying to create chat with: ${userId1} (${profile1?.name}), ${userId2} (${profile2?.name})`
  );

  try {
    const user1 = await prisma.user.findUnique({ where: { id: userId1 } });
    const user2 = await prisma.user.findUnique({ where: { id: userId2 } });

    if (!user1 || !user2) {
      console.error('One or both users not found:', { userId1, userId2 });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if a chat already exists between these two users
    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          { members: { some: { id: userId1 } } },
          { members: { some: { id: userId2 } } },
        ],
      },
      include: { members: true, messages: true },
    });

    let chat;
    if (
      existingChat &&
      existingChat.members.length === 2 &&
      existingChat.members.some(m => m.id === userId1) &&
      existingChat.members.some(m => m.id === userId2)
    ) {
      chat = existingChat;
    } else {
      chat = await prisma.chat.create({
        data: {
          members: {
            connect: [{ id: userId1 }, { id: userId2 }],
          },
        },
        include: { members: true, messages: true },
      });
    }

    // Attach profile names to members
    chat.members = await attachProfileNames(chat.members);

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Chat creation error:', error);
    return NextResponse.json({ error: 'Chat creation failed', details: error }, { status: 500 });
  }
}

// Get all chats for the logged-in user
export async function GET(req: Request) {
  const userIdHeader = req.headers.get('x-user-id');
  if (!userIdHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = parseInt(userIdHeader, 10);
  if (Number.isNaN(userId)) return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });

  console.log('Fetching chats for user:', userId);

  const chats = await prisma.chat.findMany({
    where: {
      members: { some: { id: userId } },
    },
    include: { members: true, messages: true },
  });

  // Attach profile names to all members in all chats
  for (const chat of chats) {
    chat.members = await attachProfileNames(chat.members);
  }

  return NextResponse.json(chats);
}
