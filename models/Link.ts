import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILink extends Document {
  receiverName: string;
  creatorName: string;
  createdAt: Date;
}

const LinkSchema: Schema = new Schema({
  receiverName: { type: String, required: true }, // Formerly 'name'
  creatorName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Check if model already exists to prevent overwrite error during hot reload
const Link: Model<ILink> = mongoose.models.Link || mongoose.model<ILink>('Link', LinkSchema);

export default Link;
