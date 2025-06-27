// app/api/test-db/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/db';
import Test from '../../../../models/test'; // optional model

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Optional: insert a test document
    const testDoc = await Test.create({ message: 'Hello' });

    return NextResponse.json({
      success: true,
      message: '✅ MongoDB connected successfully.',
      testDoc,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: '❌ Failed to connect to DB' }, { status: 500 });
  }
}
