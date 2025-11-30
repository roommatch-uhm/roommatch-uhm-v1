import { NextResponse } from 'next/server';
import { getChatMessages, sendMessage } from '@/lib/dbActions';

// Get all messages for a chat
export async function GET(req: Request, { params }: { params: { chatId: string } }) {
  const userIdHeader = req.headers.get('x-user-id');
  if (!userIdHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = parseInt(userIdHeader, 10);
  if (Number.isNaN(userId)) return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });

  const chatId = Number(params.chatId);
  const messages = await getChatMessages(chatId, userId);
  return NextResponse.json(messages);
}

// Send a new message in a chat
export async function POST(req: Request, { params }: { params: { chatId: string } }) {
  const userIdHeader = req.headers.get('x-user-id');
  if (!userIdHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = parseInt(userIdHeader, 10);
  if (Number.isNaN(userId)) return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });

  const chatId = Number(params.chatId);
  const { content } = await req.json();
  const message = await sendMessage(chatId, userId, content);
  return NextResponse.json(message);
}
