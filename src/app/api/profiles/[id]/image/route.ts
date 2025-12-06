import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const id = Number(params.id);
  if (Number.isNaN(id)) return new NextResponse('Invalid id', { status: 400 });

  const profile = await prisma.profile.findUnique({
    where: { id },
    select: { imageUrl: true },
  });

  if (!profile?.imageUrl) {
    return new NextResponse('Image not found', { status: 404 });
  }

  const imageUrl = profile.imageUrl;

  // Serve local images stored under public/ when path starts with '/'
  if (imageUrl.startsWith('/')) {
    const filePath = path.join(process.cwd(), 'public', imageUrl.replace(/^\//, ''));
    try {
      const data = await fs.promises.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const contentType =
        ext === '.png' ? 'image/png' :
        ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
        ext === '.webp' ? 'image/webp' :
        'application/octet-stream';

      return new NextResponse(data, {
        status: 200,
        headers: { 'Content-Type': contentType, 'Content-Length': String(data.length) },
      });
    } catch (e) {
      return new NextResponse('File not found', { status: 404 });
    }
  }

  // Otherwise redirect to external image URL
  return NextResponse.redirect(imageUrl);
}