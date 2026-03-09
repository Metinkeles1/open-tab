"use server";

import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { revalidatePath } from "next/cache";
import type { Transaction as TransactionType } from "@/types/transaction";

export async function getTransactions(customerId?: string): Promise<TransactionType[]> {
  await connectDB();

  const query = customerId ? { customerId } : {};
  const transactions = await Transaction.find(query).sort({ createdAt: -1 }).lean();

  return transactions.map((t) => ({
    id: t._id.toString(),
    customerId: t.customerId.toString(),
    type: t.type,
    amount: t.amount,
    note: t.note ?? undefined,
    createdAt: t.createdAt.toISOString(),
  }));
}

export async function addTransaction(values: {
  customerId: string;
  type: "charge" | "payment";
  amount: number;
  note?: string;
}): Promise<TransactionType> {
  await connectDB();

  const transaction = await Transaction.create({
    customerId: values.customerId,
    type: values.type,
    amount: values.amount,
    note: values.note?.trim() || undefined,
  });

  revalidatePath("/");

  return {
    id: transaction._id.toString(),
    customerId: transaction.customerId.toString(),
    type: transaction.type,
    amount: transaction.amount,
    note: transaction.note ?? undefined,
    createdAt: transaction.createdAt.toISOString(),
  };
}

export async function deleteTransactionByCustomerId(
  customerId: string,
  transactionId: string,
): Promise<void> {
  await connectDB();
  await Transaction.deleteOne({ customerId, _id: transactionId });
  revalidatePath("/");
}
