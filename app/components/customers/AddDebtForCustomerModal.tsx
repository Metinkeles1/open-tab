"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Customer } from "@/app/types";
import { toast } from "sonner";

interface AddDebtForCustomerModalProps {
  isOpen: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSubmit: (debtAmount: number, personCount: number, product: string) => Promise<void>;
}

const AddDebtForCustomerModal = ({
  isOpen,
  customer,
  onClose,
  onSubmit,
}: AddDebtForCustomerModalProps) => {
  const [amount, setAmount] = useState("");
  const [personCount, setPersonCount] = useState("");
  const [product, setProduct] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer) {
      toast.error("Müşteri bulunamadı!");
      return;
    }

    try {
      const debtAmount = parseFloat(amount) || 0;
      const personCountValue = parseInt(personCount) || 0;
      const productValue = product || "";

      await onSubmit(debtAmount, personCountValue, productValue);

      toast.success("Borç başarıyla eklendi!");

      setAmount("");
      setPersonCount("");
      setProduct("");

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      toast.error("Borç eklenirken bir hata oluştu: " + (error as Error).message);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !customer) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Borç Ekle</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Müşteri</p>
            <p className="text-lg font-semibold text-gray-800">{customer.name}</p>
            <p className="text-sm text-gray-600 mt-2">Mevcut Borç</p>
            <p className="text-lg font-semibold text-red-600">
              {customer.debt.toFixed(2)} ₺
            </p>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Eklenecek Tutar (₺)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:bg-gray-100"
            />
            <input
              type="number"
              value={personCount}
              onChange={(e) => setPersonCount(e.target.value)}
              placeholder="Kişi Sayısı"
              step="1"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:bg-gray-100 mt-2"
            />
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Ürün Adı"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:bg-gray-100 mt-2"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition font-medium"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
            >
              Borç Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDebtForCustomerModal;
