export type TransactionType = "charge" | "payment";

export type Transaction = {
  id: string;
  customerId: string;
  type: TransactionType;
  amount: number;
  note?: string;
  createdAt: string;
};
