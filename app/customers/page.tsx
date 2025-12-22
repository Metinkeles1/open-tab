"use client";
import axios from "axios";
import { useEffect, useState } from "react";

type Customer = {
  id: string;
  name: string;
};

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("/api/customers");
        setCustomers(res.data);
      } catch (error) {
        console.error("Müşteri verisi çekilirken hata:", error);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>{customer.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Customers;
