import mongoose, { Schema, Document, Model } from "mongoose";

export type CustomerMode = "creditor" | "debtor";

export interface ICustomer extends Document {
  name: string;
  phone?: string;
  note?: string;
  mode: CustomerMode;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    note: { type: String, trim: true },
    mode: { type: String, enum: ["creditor", "debtor"], default: "creditor" },
  },
  {
    timestamps: true,
  },
);

const Customer: Model<ICustomer> =
  mongoose.models.Customer ?? mongoose.model<ICustomer>("Customer", CustomerSchema);

export default Customer;
