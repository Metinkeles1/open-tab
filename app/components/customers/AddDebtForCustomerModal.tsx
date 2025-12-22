"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { Customer } from "@/app/types";

interface AddDebtForCustomerModalProps {
  isOpen: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddDebtForCustomerModal = ({
  isOpen,
  customer,
  onClose,
  onSuccess,
}: AddDebtForCustomerModalProps) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer || !amount || isNaN(parseFloat(amount))) {
      setMessageType("error");
      setMessage("Lütfen geçerli bir tutar girin");
      return;
    }

    const debtAmount = parseFloat(amount);
    if (debtAmount <= 0) {
      setMessageType("error");
      setMessage("Borç miktarı 0'dan büyük olmalıdır");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const newDebt = customer.debt + debtAmount;
      await axios.put(`/api/customers/${customer.id}`, { debt: newDebt });

      setMessageType("success");
      setMessage("✓ Borç başarıyla eklendi!");
      setAmount("");

      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (error) {
      setMessageType("error");
      setMessage("✗ Hata oluştu, lütfen tekrar deneyin");
    } finally {
      setLoading(false);
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
              disabled={loading}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:bg-gray-100"
            />
          </div>

          {/* Message */}
          {message && (
            <div
              className={`py-3 px-4 rounded-lg text-sm font-medium ${
                messageType === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition font-medium"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading || !amount}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
            >
              {loading ? "..." : "Borç Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDebtForCustomerModal;
