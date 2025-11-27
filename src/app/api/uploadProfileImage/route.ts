import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file)
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true }); // ensure folder exists

  await writeFile(
    path.join(uploadsDir, file.name),
    Buffer.from(await file.arrayBuffer()),
  );

  const url = `/uploads/${file.name}`;
  return NextResponse.json({ url });
}
