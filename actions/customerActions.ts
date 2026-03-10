"use server";

import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { revalidatePath } from "next/cache";
import type { Customer as CustomerType } from "@/types/customer";
import Transaction from "@/models/Transaction";

export async function getCustomers(
  mode?: "creditor" | "debtor",
): Promise<CustomerType[]> {
  await connectDB();
  const query = mode ? { mode } : {};
  const customers = await Customer.find(query).sort({ createdAt: -1 }).lean();
  return customers.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    phone: c.phone ?? undefined,
    note: c.note ?? undefined,
    mode: (c.mode ?? "creditor") as "creditor" | "debtor",
    createdAt: c.createdAt.toISOString(),
  }));
}

export async function addCustomer(values: {
  name: string;
  phone?: string;
  note?: string;
  mode: "creditor" | "debtor";
}): Promise<CustomerType> {
  await connectDB();
  const customer = await Customer.create({
    name: values.name.trim(),
    phone: values.phone?.trim() || undefined,
    note: values.note?.trim() || undefined,
    mode: values.mode,
  });

  revalidatePath("/");

  return {
    id: customer._id.toString(),
    name: customer.name,
    phone: customer.phone ?? undefined,
    note: customer.note ?? undefined,
    mode: customer.mode as "creditor" | "debtor",
    createdAt: customer.createdAt.toISOString(),
  };
}

export async function deleteCustomer(customerId: string): Promise<void> {
  await connectDB();
  await Customer.findByIdAndDelete(customerId);
  await Transaction.deleteMany({ customerId });
  revalidatePath("/");
}
