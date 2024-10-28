// app/api/r2r/documents/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:7272/v2/documents_overview');

    if (!response.ok) {
      throw new Error('Failed to fetch documents overview');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Documents overview error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' }, 
      { status: 500 }
    );
  }
}
