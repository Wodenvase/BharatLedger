import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    console.log('[Upload API] Request received');
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.log('[Upload API] No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    console.log('[Upload API] Fetching user from database');
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.log('[Upload API] User not found in database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('[Upload API] User found:', user.id);

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const accountId = formData.get('accountId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    // Verify the account belongs to the user
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: user.id,
      },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Validate file type (should be CSV)
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only CSV files are allowed' 
      }, { status: 400 });
    }

    console.log('[Upload API] File received:', file.name, 'Size:', file.size);

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'uploads', user.id);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${accountId}_${timestamp}_${file.name}`;
    const filePath = join(uploadDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    console.log('[Upload API] File saved to:', filePath);

    // Update account in database
    await prisma.account.update({
      where: { id: accountId },
      data: {
        connected: true,
        lastUploaded: new Date(),
        filePath: filePath,
      },
    });

    console.log('[Upload API] Account updated successfully');

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      fileName: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Upload API] Error:', error);
    console.error('[Upload API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
    }, { status: 500 });
  }
}
