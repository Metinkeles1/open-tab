import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AddCustomerForm from "@/app/components/customers/AddCustomerForm";

const page = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/customers"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft size={20} />
          Müşteri Listesine Dön
        </Link>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Yeni Müşteri Ekle</h1>
          <p className="text-gray-600 mb-6">
            Aşağıdaki forma müşteri bilgilerini girerek yeni müşteri ekleyebilirsiniz.
          </p>

          <AddCustomerForm />
        </div>
      </div>
    </div>
  );
};

export default page;
