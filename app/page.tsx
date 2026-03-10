"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

const CustomersView = dynamic(() => import("@/components/customers/CustomersView"), {
  ssr: false,
});

type Tab = "creditor" | "debtor";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("creditor");

  return (
    <div className="flex flex-col h-full overflow-hidden gap-4">
      {/* Sekme Başlıkları */}
      <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700/60 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("creditor")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeTab === "creditor"
              ? "bg-rose-500 text-white shadow"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Borçlarım
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("debtor")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeTab === "debtor"
              ? "bg-emerald-500 text-white shadow"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Alacaklarım
        </button>
      </div>

      {/* İçerik */}
      <div className="flex-1 overflow-hidden">
        <CustomersView key={activeTab} mode={activeTab} />
      </div>
    </div>
  );
}
