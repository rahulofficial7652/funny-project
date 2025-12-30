import { notFound } from "next/navigation";
import LoveRequest from "./love-request-component";
import connectDB from "@/lib/db";
import Link from "@/models/Link";

export default async function LinkPage({ params }: { params: Promise<{ linkId: string }> }) {
  const { linkId } = await params;
  
  await connectDB();

  // Validate ObjectId format to prevent crash
  if (!linkId.match(/^[0-9a-fA-F]{24}$/)) {
    notFound();
  }

  const link = await Link.findById(linkId).lean();

  if (!link) {
    notFound();
  }

  // Convert ObjectId to string for Client Component
  const serializedLink = {
    ...link,
    _id: link._id.toString(),
    createdAt: link.createdAt.toISOString()
  };

  return <LoveRequest id={serializedLink._id} name={serializedLink.receiverName} />;
}
