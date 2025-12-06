
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const profile = await prisma.profile.findUnique({
    where: { id: Number(params.id) },
    select: { imageData: true },
  });

  if (!profile?.imageData) {
    return new NextResponse('Image not found', { status: 404 });
  }

  // Convert Buffer to Uint8Array for NextResponse
  const uint8 = new Uint8Array(profile.imageData as Buffer);

  return new NextResponse(uint8, {
    status: 200,
    headers: {
      'Content-Type': 'image/jpeg', // Change if you store PNG, etc.
      'Content-Length': String(uint8.length),
    },
  });
}
