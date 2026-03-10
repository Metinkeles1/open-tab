"use client";

import { useCallback, useEffect, useState } from "react";
import { Customer } from "@/types/customer";
import { FormValues } from "@/components/customers/CustomerForm";
import { getCustomers, addCustomer, deleteCustomer } from "@/actions/customerActions";

export function useCustomers(mode: "creditor" | "debtor" = "creditor") {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCustomers(mode);
      setCustomers(data);
    } catch (err) {
      setError("Müşteriler yüklenirken bir hata oluştu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleAddCustomer = async (values: FormValues) => {
    try {
      const newCustomer = await addCustomer({
        name: values.name,
        phone: values.phone?.trim() || undefined,
        note: values.note?.trim() || undefined,
        mode,
      });
      setCustomers((prev) => [newCustomer, ...prev]);
    } catch (err) {
      console.error("Müşteri eklenirken hata:", err);
      throw err;
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    const previousCustomers = customers;
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    try {
      await deleteCustomer(customerId);
    } catch (error) {
      setCustomers(previousCustomers);
      console.error("Müşteri silinirken hata:", error);
      throw error;
    }
  };

  return {
    customers,
    loading,
    error,
    handleDeleteCustomer,
    handleAddCustomer,
    refetch: fetchCustomers,
  };
}
