import { NextResponse } from 'next/server';
import { searchRules } from '@/lib/searchEngine.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    const part = searchParams.get('part') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const results = searchRules(q, { type, part, limit, offset });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
