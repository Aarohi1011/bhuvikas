import { NextResponse } from 'next/server';
import { getRuleById } from '@/lib/searchEngine.js';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const rule = getRuleById(id);

    if (!rule) {
      return NextResponse.json(
        { success: false, error: `Rule '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      rule
    });
  } catch (error) {
    console.error('Rule detail API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
