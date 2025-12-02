import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { MAX_PROFILE_IMAGE_SIZE, ALLOWED_IMAGE_TYPES } from '@/lib/validationSchemas';

/**
 * Upload endpoint for profile images with comprehensive validation:
 * - File size limit (5MB)
 * - File type validation (images only)
 * - Secure filename handling
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    // Validate file exists
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      const maxSizeMB = MAX_PROFILE_IMAGE_SIZE / (1024 * 1024);
      return NextResponse.json(
        {
          error: `File size exceeds maximum allowed size of ${maxSizeMB}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
        },
        { status: 400 },
      );
    }

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type. Only ${ALLOWED_IMAGE_TYPES.join(', ')} are allowed. You uploaded: ${file.type}`,
        },
        { status: 400 },
      );
    }

    // Validate file has content
    if (file.size === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }

    // Sanitize filename to prevent path traversal attacks
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Generate unique filename with timestamp to prevent overwriting
    const uniqueFilename = `${Date.now()}-${sanitizedFilename}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true }); // ensure folder exists

    // Write file to disk
    const filePath = path.join(uploadsDir, uniqueFilename);
    await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    const url = `/uploads/${uniqueFilename}`;

    return NextResponse.json({
      url,
      filename: uniqueFilename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image. Please try again.' },
      { status: 500 },
    );
  }
}
