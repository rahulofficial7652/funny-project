import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Link from "@/models/Link";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const { receiverName, creatorName } = body;

    if (!receiverName || !creatorName) {
      return NextResponse.json({ error: "Receiver Name and Creator Name are required" }, { status: 400 });
    }

    const newLink = await Link.create({
      receiverName: receiverName.trim(),
      creatorName: creatorName.trim(),
    });

    logger.info(`Link created: ${newLink._id}`);

    return NextResponse.json({
        id: newLink._id.toString(),
        receiverName: newLink.receiverName,
        createdAt: newLink.createdAt
    });
  } catch (error) {
    logger.error("Failed to create link", error);
    return NextResponse.json(
      { 
        error: "Failed to create link",
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}
