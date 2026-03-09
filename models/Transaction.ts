import mongoose, { Schema, Document, Model } from "mongoose";

export type TransactionType = "charge" | "payment";

export interface ITransaction extends Document {
  customerId: mongoose.Types.ObjectId;
  type: TransactionType;
  amount: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    type: { type: String, enum: ["charge", "payment"], required: true },
    amount: { type: Number, required: true, min: 0 },
    note: { type: String, trim: true },
  },
  {
    timestamps: true,
  },
);

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ??
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
