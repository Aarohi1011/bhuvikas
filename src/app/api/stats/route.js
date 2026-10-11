import { NextResponse } from 'next/server';
import { getDatabaseMetadata } from '@/lib/searchEngine.js';

export async function GET() {
  try {
    const metadata = getDatabaseMetadata();
    return NextResponse.json({
      success: true,
      metadata
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
