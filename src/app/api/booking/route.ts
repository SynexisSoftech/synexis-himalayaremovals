import { NextRequest, NextResponse } from 'next/server';

import Booking from '../../../../models/booking';
import { connectToDatabase } from '@/app/lib/mongodb'

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();

    const {
      fullName,
      emailAddress,
      phoneNumber,
      serviceType,
      fromLocation,
      toLocation,
      preferredMovingdate,
      preferredTime,
      ProperSize,
      EstimatedWeight,
      SpecialRequirement,
      AdditionalService,
    } = data;

    // Simple validation
    if (
      !fullName ||
      !emailAddress ||
      !phoneNumber ||
      !serviceType ||
      !fromLocation ||
      !toLocation ||
      !preferredMovingdate ||
      !preferredTime ||
      !ProperSize ||
      !EstimatedWeight ||
      !SpecialRequirement ||
      !AdditionalService
    ) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const booking = await Booking.create(data);
    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}


export async function GET() {
  try {
    await connectToDatabase();
    const bookings = await Booking.find().sort({ createdAt: -1 }); // most recent first
    return NextResponse.json({ success: true, bookings }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}