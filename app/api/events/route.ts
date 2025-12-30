import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { linkId, eventType, metadata } = body;

    // Strict validation
    if (!linkId || !eventType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const validEventTypes = ["page_open", "reject_attempt", "dodge_attempt", "accept", "final_reject"];
    if (!validEventTypes.includes(eventType)) {
       return NextResponse.json({ error: "Invalid eventType" }, { status: 400 });
    }

    await connectDB();

    const newEvent = await Event.create({
      linkId,
      eventType,
      metadata: metadata || {},
    });

    return NextResponse.json({ id: newEvent._id });
  } catch (error) {
    logger.error("Failed to persist event", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
