// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';
import Contact from '../../../../models/contact'; // Make sure this path matches your structure

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { fullname, email, phonenumber,message,serviceRequired } = body;

    // Validation
    if (!fullname || !email || !phonenumber || !message || !serviceRequired) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const newContact = await Contact.create({ fullname, email, phonenumber , message, serviceRequired });

    return NextResponse.json({
      success: true,
      message: '✅ Contact saved successfully.',
      data: newContact,
    });
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    return NextResponse.json({ success: false, error: '❌ Failed to save contact.' }, { status: 500 });
  }
}




export async function GET() {
  try {
    await connectToDatabase();

    const contacts = await Contact.find().sort({ _id: -1 }); // newest first

    return NextResponse.json({
      success: true,
      message: '✅ Contacts fetched successfully.',
      data: contacts,
    });
  } catch (error) {
    console.error('❌ Error fetching contacts:', error);
    return NextResponse.json({ success: false, error: '❌ Failed to fetch contacts.' }, { status: 500 });
  }
}