import React from "react";
import { HiUsers } from "react-icons/hi2";
import CustomerCard from "./CustomerCard";
import { Customer } from "@/types/customer";

const CustomerList = ({
  customers,
  balanceByCustomerId,
  onSelect,
}: {
  customers: Customer[];
  balanceByCustomerId: Record<string, number>;
  onSelect: (id: string) => void;
}) => {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 px-0.5">
        Müşteriler
      </p>
      {customers?.length === 0 ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700/60 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-700/60 flex items-center justify-center mx-auto mb-3">
            <HiUsers className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-sm text-slate-400">Henüz müşteri eklenmemiş.</p>
          <p className="text-xs text-slate-500 mt-1">
            Yukarıdan yeni müşteri ekleyebilirsin.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {customers?.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              balance={balanceByCustomerId[customer.id] || 0}
              onSelect={() => onSelect(customer.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerList;
