export type Customer = {
  id: string;
  name: string;
};

export type Order = {
  id: string;
  customerId: string;
  amount: number;
  date: string;
};
