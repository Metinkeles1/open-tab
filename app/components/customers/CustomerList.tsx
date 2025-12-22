"use client";

import { Customer } from "@/app/types";
import { Trash2, Edit2 } from "lucide-react";

interface CustomerListProps {
  customers: Customer[];
  onDelete: (id: string) => void;
  onEdit: (customer: Customer) => void;
  addDebt: (customer: Customer) => void;
}

export default function CustomerList({
  customers,
  onDelete,
  onEdit,
  addDebt,
}: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">Henüz müşteri yok</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-300">
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Adı</th>
            <th className="px-6 py-3 text-right font-semibold text-gray-700">Borç (₺)</th>
            <th className="px-6 py-3 text-center font-semibold text-gray-700">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td className="px-6 py-4 text-gray-800">{customer.name}</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-800">
                {customer.debt.toFixed(2)} ₺
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onEdit(customer)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                    title="Düzenle"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(customer.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                    title="Sil"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => addDebt(customer)}
                    className="p-2 text-green-600 hover:bg-green-100 rounded transition"
                    title="Ekle"
                  >
                    Ekle
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
