"use client";

import { Transaction } from "@/types/transaction";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getTransactions,
  addTransaction,
  deleteTransactionByCustomerId,
} from "@/actions/transactionActions";

export function useTransactions(customerIds?: string[]) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      setError("İşlemler yüklenirken bir hata oluştu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const idSet = useMemo(
    () => (customerIds ? new Set(customerIds) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customerIds?.join(",")],
  );

  const { balanceByCustomerId, transactionByCustomerId, totalDebt, debtorCount } =
    useMemo(() => {
      const balances: Record<string, number> = {};
      const grouped: Record<string, Transaction[]> = {};

      transactions.forEach((tx) => {
        // Sadece bu sekmenin müşterilerine ait transaction'ları hesapla
        if (idSet && !idSet.has(tx.customerId)) return;

        balances[tx.customerId] ??= 0;
        grouped[tx.customerId] ??= [];

        grouped[tx.customerId].push(tx);
        balances[tx.customerId] += tx.type === "charge" ? tx.amount : -tx.amount;
      });

      const total = Object.values(balances)
        .filter((b) => b > 0)
        .reduce((sum, b) => sum + b, 0);
      const debtors = Object.values(balances).filter((b) => b > 0).length;

      return {
        balanceByCustomerId: balances,
        transactionByCustomerId: grouped,
        totalDebt: total,
        debtorCount: debtors,
      };
    }, [transactions, idSet]);

  const handleTransaction = async (
    type: "charge" | "payment",
    targetCustomerId: string | null,
    amount: string,
    note?: string,
  ): Promise<{ ok: boolean; error?: string }> => {
    if (
      !targetCustomerId ||
      !amount.trim() ||
      isNaN(Number(amount)) ||
      Number(amount) <= 0
    ) {
      return { ok: false, error: "Lütfen geçerli bir tutar girin." };
    }

    try {
      const newTransaction = await addTransaction({
        customerId: targetCustomerId,
        type,
        amount: Number(amount),
        note: note?.trim() || undefined,
      });
      setTransactions((prev) => [newTransaction, ...prev]);
      return { ok: true };
    } catch (err) {
      console.error("İşlem eklenirken hata:", err);
      return { ok: false, error: "İşlem kaydedilemedi." };
    }
  };

  const handleDeleteTransaction = async (customerId: string, transactionId: string) => {
    const previousTransactions = transactions;
    setTransactions((prev) => prev.filter((tx) => tx.id !== transactionId));
    try {
      await deleteTransactionByCustomerId(customerId, transactionId);
    } catch (err) {
      setTransactions(previousTransactions);
      console.error("İşlem silinirken hata:", err);
      throw err;
    }
  };

  return {
    transactions,
    transactionByCustomerId,
    balanceByCustomerId,
    totalDebt,
    debtorCount,
    loading,
    error,
    handleTransaction,
    handleDeleteTransaction,
    refetch: fetchTransactions,
  };
}
