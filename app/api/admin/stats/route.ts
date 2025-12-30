import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Link from "@/models/Link";
import Event from "@/models/Event";
import { logger } from "@/lib/logger";

export async function GET(req: Request) {
  try {
    const { headers } = req;
    const password = headers.get("x-admin-password");

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // 1. Total Links
    const totalLinks = await Link.countDocuments();

    // 2. Events breakdown
    const eventsAggregation = await Event.aggregate([
      { $group: { _id: "$eventType", count: { $sum: 1 } } }
    ]);
    
    const eventsByType: Record<string, number> = {};
    eventsAggregation.forEach(doc => {
      eventsByType[doc._id] = doc.count;
    });

    // 3. Accepted Count (distinct links)
    const acceptedLinks = await Event.distinct("linkId", { eventType: "accept" });

    // 4. Rejected Count (distinct links)
    const rejectedLinks = await Event.distinct("linkId", { eventType: "final_reject" });

    // 5. Recent Links
    const recentLinksDocs = await Link.find().sort({ createdAt: -1 }).limit(10).lean();
    
    // Manual hydration of events for recent links as before
    const linkIds = recentLinksDocs.map(l => l._id);
    const eventsDetails = await Event.find({ linkId: { $in: linkIds } }).sort({ createdAt: 1 }).lean();

    const recentLinks = recentLinksDocs.map((link: any) => {
        const linkEvents = eventsDetails.filter((e: any) => e.linkId.toString() === link._id.toString());
        return {
            id: link._id.toString(),
            receiverName: link.receiverName,
            creatorName: link.creatorName,
            createdAt: link.createdAt,
            events: linkEvents,
            _count: { events: linkEvents.length }
        };
    });

    return NextResponse.json({
      totalLinks,
      eventsByType,
      acceptedCount: acceptedLinks.length,
      rejectedCount: rejectedLinks.length,
      recentLinks,
    });
  } catch (error) {
    logger.error("Admin stats error", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
