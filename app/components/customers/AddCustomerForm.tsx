"use client";

import { useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";

interface AddCustomerFormProps {
  onSuccess?: () => void;
}

const AddCustomerForm = ({ onSuccess }: AddCustomerFormProps) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("/api/customers", { name, debt: 0 });
      setMessage("✓ Başarıyla eklendi!");
      setName("");
      onSuccess?.();
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("✗ Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Müşteri adı"
        required
        disabled={loading}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
      >
        <Plus size={18} />
        {loading ? "..." : "Ekle"}
      </button>
      {message && (
        <div
          className={`py-2 px-4 rounded-lg text-sm ${
            message.includes("✓")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
};

export default AddCustomerForm;
