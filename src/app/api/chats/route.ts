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

  // Fetch user names for logging
  const user1 = await prisma.user.findUnique({ where: { id: userId1 } });
  const user2 = await prisma.user.findUnique({ where: { id: userId2 } });

  const user1Name = user1 ? `${user1.firstName} ${user1.lastName}` : 'Unknown';
  const user2Name = user2 ? `${user2.firstName} ${user2.lastName}` : 'Unknown';

  console.log(
    `Trying to create chat with: ${userId1} (${user1Name}), ${userId2} (${user2Name})`
  );

  try {
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
      // Only reuse if the chat is exactly between these two users
      chat = existingChat;
    } else {
      // Create a new chat if none exists
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
