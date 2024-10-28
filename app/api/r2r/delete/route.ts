// app/api/r2r/delete/route.ts
import { NextResponse } from 'next/server';


export async function DELETE(request: Request) {
  try {
    const { filters } = await request.json();


    const r2rResponse = await fetch('http://localhost:7272/v2/delete', {
      method: 'DELETE',
      body: JSON.stringify({ filters: filters }),
    });

    if (!r2rResponse.ok) {
      const errorText = await r2rResponse.text();
      console.error('R2R error response:', errorText);
      throw new Error(errorText);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete API route error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
