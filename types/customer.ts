export type CustomerMode = "creditor" | "debtor";

export type Customer = {
  id: string;
  name: string;
  phone?: string;
  note?: string;
  mode: CustomerMode;
  createdAt: string;
};
