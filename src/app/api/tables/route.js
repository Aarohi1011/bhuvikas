import { NextResponse } from 'next/server';
import { getAllTables } from '@/lib/searchEngine.js';

export async function GET() {
  try {
    const tables = getAllTables();
    return NextResponse.json({
      success: true,
      total: tables.length,
      tables
    });
  } catch (error) {
    console.error('Tables API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
