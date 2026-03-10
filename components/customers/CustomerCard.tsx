import type { Customer } from "@/types/customer";
import { HiChevronRight } from "react-icons/hi2";

type CustomerCardProps = {
  customer: Customer;
  onSelect?: () => void;
  balance: number;
  mode: "creditor" | "debtor";
};

export default function CustomerCard({
  customer,
  onSelect,
  balance,
  mode,
}: CustomerCardProps) {
  const hasDebt = balance > 0;
  const isDebtor = mode === "debtor";

  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full text-left bg-slate-800 rounded-xl border border-slate-700/60 p-4 flex items-center justify-between gap-3 hover:bg-slate-700/40 active:bg-slate-700/60 transition-colors cursor-pointer"
    >
      {/* Avatar + Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-indigo-500/15 flex items-center justify-center shrink-0">
          <span className="text-indigo-400 font-semibold text-sm">
            {customer.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-medium text-slate-100 text-sm truncate">{customer.name}</p>
          {customer.phone && (
            <p className="text-xs text-slate-400 truncate">{customer.phone}</p>
          )}
          {customer.note && (
            <p className="text-xs text-slate-500 truncate italic">{customer.note}</p>
          )}
        </div>
      </div>

      {/* Balance + chevron */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="text-right">
          <p
            className={`text-sm font-semibold ${
              hasDebt
                ? isDebtor
                  ? "text-emerald-400"
                  : "text-rose-400"
                : "text-slate-400"
            }`}
          >
            {hasDebt ? `${balance.toLocaleString("tr-TR")}₺` : "—"}
          </p>
          <p className="text-xs text-slate-500">
            {hasDebt ? (isDebtor ? "alacak" : "borç") : "temiz"}
          </p>
        </div>
        <HiChevronRight className="w-4 h-4 text-slate-500" />
      </div>
    </button>
  );
}
