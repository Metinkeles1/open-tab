"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Customer } from "@/app/types";
import CustomerList from "@/app/components/customers/CustomerList";
import CustomerStats from "@/app/components/customers/CustomerStats";

import AddCustomerForm from "@/app/components/customers/AddCustomerForm";
import AddDebtForCustomerModal from "../components/customers/AddDebtForCustomerModal";

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await axios.get("/api/customers");
      setCustomers(res.data);
      setError(null);
    } catch (err) {
      setError("Müşteriler yüklenemedi");
      console.error("Müşteri verisi çekilirken hata:", err);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu müşteri silinecek. Emin misiniz?")) return;

    try {
      setIsLoading(true);
      await axios.delete(`/api/customers/${id}`);
      setCustomers(customers.filter((c) => c.id !== id));
    } catch {
      setError("Müşteri silinemedi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const addDebt = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4 ">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Müşteri Yönetimi</h1>
          <p className="text-gray-600">Müşterilerinizi yönetin ve borçları takip edin</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats */}
        <CustomerStats customers={customers} />

        {/* Add Customer Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <AddCustomerForm onSuccess={fetchCustomers} />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          {/* Customer List */}
          <CustomerList
            customers={customers}
            onDelete={handleDelete}
            onEdit={handleEdit}
            addDebt={addDebt}
          />
        </div>

        {/* Add Debt Modal */}
        <AddDebtForCustomerModal
          isOpen={isModalOpen}
          customer={selectedCustomer}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchCustomers}
        />
      </div>
    </div>
  );
};

export default Customers;
