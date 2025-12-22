import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full bg-red-50 text-black">
      <Link href="/customers">Müşteriler</Link>
    </main>
  );
}
