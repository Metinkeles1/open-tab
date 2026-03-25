import { Customer } from "@/types/customer";
import { Transaction } from "@/types/transaction";
import React, { useState } from "react";
import {
  HiXMark,
  HiArrowUpCircle,
  HiArrowDownCircle,
  HiChevronDown,
  HiPencilSquare,
} from "react-icons/hi2";
import { toast } from "sonner";

const CustomerTransactionSheet = ({
  selectedCustomer,
  balance,
  transactions,
  onClose,
  onTransaction,
  onDeleteCustomer,
  onDeleteTransaction,
  onUpdateTransaction,
  mode,
}: {
  selectedCustomer: Customer | null;
  balance: number;
  transactions: Transaction[];
  onClose: () => void;
  onTransaction: (
    type: "charge" | "payment",
    amount: string,
    note?: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  onDeleteCustomer: (customerId: string) => Promise<void>;
  onDeleteTransaction: (customerId: string, transactionId: string) => Promise<void>;
  onUpdateTransaction: (
    transactionId: string,
    values: { type: "charge" | "payment"; amount: number; note?: string },
  ) => Promise<{ ok: boolean; error?: string }>;
  mode: "creditor" | "debtor";
}) => {
  const isDebtor = mode === "debtor";
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(
    null,
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editType, setEditType] = useState<"charge" | "payment">("charge");
  const [editError, setEditError] = useState<string | null>(null);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteCustomerLoading, setDeleteCustomerLoading] = useState(false);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);

  const handleClose = () => {
    setAmount("");
    setNote("");
    setTransactionError(null);
    setEditingId(null);
    setEditError(null);
    onClose();
  };

  const startEdit = (tx: Transaction) => {
    setEditingId(tx.id);
    setEditAmount(String(tx.amount));
    setEditNote(tx.note ?? "");
    setEditType(tx.type);
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError(null);
  };

  const submitEdit = async (txId: string) => {
    const parsed = Number(editAmount);
    if (!editAmount.trim() || isNaN(parsed) || parsed <= 0) {
      setEditError("Lütfen geçerli bir tutar girin.");
      return;
    }
    setEditLoading(true);
    const result = await onUpdateTransaction(txId, {
      type: editType,
      amount: parsed,
      note: editNote.trim() || undefined,
    });
    setEditLoading(false);
    if (!result.ok) {
      setEditError(result.error ?? "Güncellenemedi.");
      toast.error(result.error ?? "İşlem güncellenemedi.");
      return;
    }
    toast.success("İşlem başarıyla güncellendi.");
    setEditingId(null);
    setEditError(null);
  };

  const handleTransactionClick = async (type: "charge" | "payment") => {
    setTransactionLoading(true);
    const result = await onTransaction(type, amount, note);
    setTransactionLoading(false);
    if (!result.ok) {
      setTransactionError(result.error ?? null);
      toast.error(result.error ?? "İşlem kaydedilemedi.");
      return;
    }
    setAmount("");
    setNote("");
    setTransactionError(null);
    toast.success(
      type === "charge" ? "Satış/alışveriş kaydedildi." : "Ödeme kaydedildi.",
    );
  };

  return (
    <>
      {/* İşlem Paneli — bottom sheet gibi */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-20 flex flex-col justify-end sm:justify-center sm:items-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Panel */}
          <div className="relative bg-slate-800 border border-slate-700/60 w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl p-5 shadow-2xl z-10">
            {/* Handle */}
            <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-4 sm:hidden" />
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/15 flex items-center justify-center shrink-0">
                  <span className="text-indigo-400 font-semibold text-sm">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-100 text-sm">
                    {selectedCustomer.name}
                  </p>
                  {selectedCustomer.phone && (
                    <p className="text-xs text-slate-400">{selectedCustomer.phone}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-slate-700/60 flex items-center justify-center hover:bg-slate-600/60 transition-colors cursor-pointer"
              >
                <HiXMark className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div
              className={`rounded-xl p-3 mb-4 ${balance > 0 ? (isDebtor ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-rose-500/10 border border-rose-500/20") : "bg-slate-700/30 border border-slate-600/30"}`}
            >
              <p className="text-xs text-slate-400 mb-0.5">
                {isDebtor ? "Mevcut Alacak" : "Mevcut Borç"}
              </p>
              <p
                className={`text-xl font-bold ${balance > 0 ? (isDebtor ? "text-emerald-400" : "text-rose-400") : "text-slate-400"}`}
              >
                {balance > 0
                  ? `${balance.toLocaleString("tr-TR")}₺`
                  : isDebtor
                    ? "Alacak Yok"
                    : "Borç Yok"}
              </p>
            </div>{" "}
            {/* Tutar Input */}
            <div className="relative mb-1">
              <input
                type="number"
                inputMode="decimal"
                autoFocus
                onChange={(e) => {
                  setAmount(e.target.value);
                  setTransactionError(null);
                }}
                value={amount}
                placeholder="Tutar girin"
                className={`w-full rounded-xl border bg-slate-900/50 pl-3 pr-8 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${transactionError ? "border-rose-500" : "border-slate-700"}`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
                ₺
              </span>
            </div>
            {transactionError && (
              <p className="text-xs text-rose-500 mb-2">{transactionError}</p>
            )}
            {/* Note Input */}
            <div className="relative mb-1">
              <textarea
                onChange={(e) => {
                  setNote(e.target.value);
                  setTransactionError(null);
                }}
                value={note}
                placeholder="Not girin"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/50 pl-3 pr-8 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
              />
            </div>
            {/* Butonlar */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                disabled={transactionLoading}
                className="rounded-xl bg-rose-500 hover:bg-rose-600 active:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed px-3 py-3 text-sm font-medium text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                onClick={() => handleTransactionClick("charge")}
              >
                {transactionLoading ? (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : null}
                {isDebtor ? "Satış Ekle" : "Alışveriş Ekle"}
              </button>
              <button
                type="button"
                disabled={transactionLoading}
                className="rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed px-3 py-3 text-sm font-medium text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                onClick={() => handleTransactionClick("payment")}
              >
                {transactionLoading ? (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : null}
                Ödeme Ekle
              </button>
              <button
                type="button"
                disabled={deleteCustomerLoading}
                className="col-span-2 rounded-xl bg-slate-700/60 hover:bg-rose-500/20 border border-slate-600 hover:border-rose-500/40 px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-1 flex items-center justify-center gap-2"
                onClick={async () => {
                  if (
                    !confirm(
                      `${selectedCustomer.name} silinsin mi? Bu işlem geri alınamaz.`,
                    )
                  )
                    return;
                  setDeleteCustomerLoading(true);
                  try {
                    await onDeleteCustomer(selectedCustomer.id);
                    toast.success(`${selectedCustomer.name} silindi.`);
                    onClose();
                  } catch {
                    toast.error("Müşteri silinemedi.");
                  } finally {
                    setDeleteCustomerLoading(false);
                  }
                }}
              >
                {deleteCustomerLoading ? (
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : null}
                {isDebtor ? "Müşteriyi Sil" : "Alacaklıyı Sil"}
              </button>
            </div>
            {/* İşlem Geçmişi */}
            {transactions.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                  İşlem Geçmişi
                </p>
                <div className="space-y-1.5 max-h-52 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]  pr-0.5">
                  {[...transactions].map((tx) => {
                    const isOpen = selectedTransaction?.id === tx.id;
                    return (
                      <div key={tx.id} className="rounded-lg overflow-hidden">
                        {/* Satır */}
                        <button
                          type="button"
                          onClick={() => setSelectedTransaction(isOpen ? null : tx)}
                          className="w-full flex items-center justify-between bg-slate-900/50 px-3 py-2 cursor-pointer hover:bg-slate-900/80 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {tx.type === "charge" ? (
                              <HiArrowDownCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            ) : (
                              <HiArrowUpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            <div className="text-left">
                              <p className="text-xs font-medium text-slate-200">
                                {tx.type === "charge" ? "Alışveriş" : "Ödeme"}
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(tx.createdAt).toLocaleString("tr-TR", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`text-sm font-semibold ${
                                tx.type === "charge"
                                  ? "text-rose-400"
                                  : "text-emerald-400"
                              }`}
                            >
                              {tx.type === "charge" ? "+" : "-"}
                              {tx.amount.toLocaleString("tr-TR")}₺
                            </span>
                            <HiChevronDown
                              className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            />
                          </div>
                        </button>

                        {/* Accordion Detay */}
                        {isOpen && (
                          <div className="bg-slate-900/70 border-t border-slate-700/40 px-3 py-2.5 space-y-2">
                            {editingId === tx.id ? (
                              /* Düzenleme Formu */
                              <div className="space-y-2">
                                {/* Tip Seçimi */}
                                <div className="grid grid-cols-2 gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setEditType("charge")}
                                    className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                                      editType === "charge"
                                        ? "bg-rose-500 text-white"
                                        : "bg-slate-700/60 text-slate-400 hover:bg-slate-700"
                                    }`}
                                  >
                                    {isDebtor ? "Satış" : "Alışveriş"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditType("payment")}
                                    className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                                      editType === "payment"
                                        ? "bg-emerald-500 text-white"
                                        : "bg-slate-700/60 text-slate-400 hover:bg-slate-700"
                                    }`}
                                  >
                                    Ödeme
                                  </button>
                                </div>
                                {/* Tutar */}
                                <div className="relative">
                                  <input
                                    type="number"
                                    inputMode="decimal"
                                    autoFocus
                                    value={editAmount}
                                    onChange={(e) => {
                                      setEditAmount(e.target.value);
                                      setEditError(null);
                                    }}
                                    placeholder="Tutar"
                                    className={`w-full rounded-lg border bg-slate-900/60 pl-2.5 pr-7 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition ${
                                      editError ? "border-rose-500" : "border-slate-700"
                                    }`}
                                  />
                                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                                    ₺
                                  </span>
                                </div>
                                {editError && (
                                  <p className="text-xs text-rose-500">{editError}</p>
                                )}
                                {/* Not */}
                                <textarea
                                  value={editNote}
                                  onChange={(e) => setEditNote(e.target.value)}
                                  placeholder="Not (isteğe bağlı)"
                                  rows={2}
                                  className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-2.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition resize-none"
                                />
                                {/* Kaydet / İptal */}
                                <div className="flex gap-1.5">
                                  <button
                                    type="button"
                                    disabled={editLoading}
                                    onClick={() => submitEdit(tx.id)}
                                    className="flex-1 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed px-2 py-1.5 text-xs font-medium text-white transition-colors cursor-pointer flex items-center justify-center gap-1"
                                  >
                                    {editLoading ? (
                                      <svg
                                        className="animate-spin h-3 w-3 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                        />
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                      </svg>
                                    ) : null}
                                    {editLoading ? "Kaydediliyor..." : "Kaydet"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="flex-1 rounded-lg bg-slate-700/60 hover:bg-slate-700 px-2 py-1.5 text-xs font-medium text-slate-400 transition-colors cursor-pointer"
                                  >
                                    İptal
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Normal Detay Görünümü */
                              <>
                                {tx.note ? (
                                  <p className="text-xs text-slate-300 leading-relaxed">
                                    <span className="text-slate-500 mr-1">Not:</span>
                                    {tx.note}
                                  </p>
                                ) : (
                                  <p className="text-xs text-slate-600 italic">
                                    Not eklenmemiş
                                  </p>
                                )}
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => startEdit(tx)}
                                    className="flex items-center gap-1 text-xs text-indigo-400/70 hover:text-indigo-400 transition-colors cursor-pointer"
                                  >
                                    <HiPencilSquare className="w-3.5 h-3.5" />
                                    Düzenle
                                  </button>
                                  <button
                                    type="button"
                                    disabled={deletingTransactionId === tx.id}
                                    onClick={async () => {
                                      if (
                                        !confirm(
                                          `Bu işlem silinsin mi? Bu işlem geri alınamaz.`,
                                        )
                                      )
                                        return;
                                      setDeletingTransactionId(tx.id);
                                      try {
                                        await onDeleteTransaction(
                                          selectedCustomer.id,
                                          tx.id,
                                        );
                                        toast.success("İşlem başarıyla silindi.");
                                      } catch {
                                        toast.error("İşlem silinemedi.");
                                      } finally {
                                        setDeletingTransactionId(null);
                                      }
                                    }}
                                    className="flex items-center gap-1 text-xs text-rose-400/70 hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-60"
                                  >
                                    {deletingTransactionId === tx.id ? (
                                      <svg
                                        className="animate-spin h-3 w-3"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                        />
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                      </svg>
                                    ) : (
                                      <span>✕</span>
                                    )}
                                    Sil
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerTransactionSheet;
