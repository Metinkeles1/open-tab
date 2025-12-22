export type Customer = {
  id: string;
  name: string;
  debt: number;
};

export type Order = {
  id: string;
  customerId: string;
  amount: number;
  date: string;
};
