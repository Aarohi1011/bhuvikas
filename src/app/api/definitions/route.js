import { NextResponse } from 'next/server';
import { getAllDefinitions } from '@/lib/searchEngine.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').toLowerCase().trim();

    let defs = getAllDefinitions();
    if (q) {
      defs = defs.filter(d => 
        d.term.toLowerCase().includes(q) || 
        d.definition.toLowerCase().includes(q) ||
        (d.keywords && d.keywords.some(k => k.toLowerCase().includes(q)))
      );
    }

    return NextResponse.json({
      success: true,
      total: defs.length,
      definitions: defs
    });
  } catch (error) {
    console.error('Definitions API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
