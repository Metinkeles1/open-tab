"use client";
import CustomerForm from "@/components/customers/CustomerForm";
import { useState, useMemo } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { useTransactions } from "@/hooks/useTransactions";
import { HiPlus, HiChevronDown } from "react-icons/hi2";
import CustomerList from "./CustomerList";
import CustomerTransactionSheet from "./CustomerTransactionSheet";

type Mode = "creditor" | "debtor";

const CustomersView = ({ mode }: { mode: Mode }) => {
  const isDebtor = mode === "debtor";

  const { customers, handleAddCustomer, handleDeleteCustomer, loading, error } =
    useCustomers(mode);

  const customerIds = useMemo(() => customers.map((c) => c.id), [customers]);

  const {
    balanceByCustomerId,
    transactionByCustomerId,
    totalDebt,
    debtorCount,
    handleTransaction,
    handleDeleteTransaction,
  } = useTransactions(customerIds);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const selectedCustomer = customers?.find((c) => c.id === selectedCustomerId) || null;

  const [showForm, setShowForm] = useState(false);

  const selectedTransactions = transactionByCustomerId[selectedCustomer?.id ?? ""] ?? [];

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-800 rounded-xl border border-slate-700/60 p-4 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700" />
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-slate-700 rounded w-1/3" />
                <div className="h-3 bg-slate-700 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 text-center">
        <p className="text-sm text-rose-400 font-medium">{error}</p>
        <p className="text-xs text-slate-500 mt-1">Sayfayı yenileyerek tekrar dene.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden gap-4">
      {/* Özet Kartlar */}
      <div className="grid grid-cols-2 gap-3 shrink-0">
        <div className="bg-slate-800 rounded-xl border border-slate-700/60 p-3.5">
          <p className="text-xs text-slate-400 mb-0.5">
            {isDebtor ? "Toplam Müşteri" : "Toplam Alacaklı"}
          </p>
          <p className="text-2xl font-bold text-slate-100">{customers?.length ?? 0}</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700/60 p-3.5">
          <p className="text-xs text-slate-400 mb-0.5">
            {isDebtor ? "Toplam Alacak" : "Toplam Borç"}
          </p>
          <p
            className={`text-2xl font-bold ${totalDebt > 0 ? (isDebtor ? "text-emerald-400" : "text-rose-400") : "text-slate-100"}`}
          >
            {totalDebt > 0 ? `${totalDebt.toLocaleString("tr-TR")}₺` : "—"}
          </p>
          {debtorCount > 0 && (
            <p className="text-xs text-slate-500 mt-0.5">
              {debtorCount} kişide {isDebtor ? "alacak" : "borç"} var
            </p>
          )}
        </div>
      </div>

      {/* Yeni Kayıt Toggle */}
      <div className="shrink-0">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="w-full flex items-center justify-between bg-slate-800 rounded-xl border border-slate-700/60 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700/60 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <HiPlus className="w-3 h-3 text-indigo-400" />
            </span>
            {isDebtor ? "Yeni Müşteri Ekle" : "Yeni Alacaklı Ekle"}
          </span>
          <HiChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform ${showForm ? "rotate-180" : ""}`}
          />
        </button>
        {showForm && (
          <div className="mt-2">
            <CustomerForm
              onAdd={async (v) => {
                await handleAddCustomer(v);
                setShowForm(false);
              }}
            />
          </div>
        )}
      </div>

      <CustomerList
        customers={customers}
        balanceByCustomerId={balanceByCustomerId}
        onSelect={setSelectedCustomerId}
        mode={mode}
      />

      <CustomerTransactionSheet
        selectedCustomer={selectedCustomer}
        balance={balanceByCustomerId[selectedCustomer?.id ?? ""] || 0}
        transactions={selectedTransactions}
        onClose={() => setSelectedCustomerId(null)}
        onTransaction={(type, amount, note) =>
          handleTransaction(type, selectedCustomerId, amount, note)
        }
        onDeleteCustomer={handleDeleteCustomer}
        onDeleteTransaction={handleDeleteTransaction}
        mode={mode}
      />
    </div>
  );
};

export default CustomersView;
