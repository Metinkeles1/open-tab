"use client";
import dynamic from "next/dynamic";

const CustomersView = dynamic(() => import("@/components/customers/CustomersView"), {
  ssr: false,
});

export default function Home() {
  return <CustomersView />;
}
