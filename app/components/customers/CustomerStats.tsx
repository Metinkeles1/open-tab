import { Customer } from "@/app/types";

interface CustomerStatsProps {
  customers: Customer[];
}

export default function CustomerStats({ customers }: CustomerStatsProps) {
  const totalDebt = customers.reduce((sum, c) => sum + c.debt, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-sm font-medium mb-2">Toplam Müşteri</p>
        <p className="text-3xl font-bold text-gray-800">{customers.length}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-sm font-medium mb-2">Toplam Borç</p>
        <p className="text-3xl font-bold text-red-600">{totalDebt.toFixed(2)} ₺</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-sm font-medium mb-2">Borçlu Müşteri</p>
        <p className="text-3xl font-bold text-orange-600">
          {customers.filter((c) => c.debt > 0).length}
        </p>
      </div>
    </div>
  );
}
