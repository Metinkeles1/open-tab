export type Customer = {
  id: string;
  name: string;
  debt: number;
  personCount: number;
  product: string;
};

export type Order = {
  id: string;
  customerId: string;
  amount: number;
  date: string;
};
