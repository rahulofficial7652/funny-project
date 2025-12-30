import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  linkId: mongoose.Types.ObjectId;
  eventType: "page_open" | "reject_attempt" | "dodge_attempt" | "accept" | "final_reject";
  device?: string;
  metadata?: any;
  createdAt: Date;
}

const EventSchema: Schema = new Schema({
  linkId: { type: Schema.Types.ObjectId, ref: 'Link', required: true },
  eventType: { 
    type: String, 
    required: true,
    enum: ["page_open", "reject_attempt", "dodge_attempt", "accept", "final_reject"]
  },
  device: { type: String },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
