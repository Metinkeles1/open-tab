import { NextResponse, NextRequest } from "next/server";
import { Customer } from "@/app/types/index";

// Mock customers data - gerçek uygulamada veritabanından gelecek
const customers: Customer[] = [
  { id: "1", name: "Alice", debt: 150 },
  { id: "2", name: "Bob", debt: 250 },
  { id: "3", name: "Charlie", debt: 0 },
  { id: "4", name: "Diana", debt: 500 },
];

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return NextResponse.json({ error: "Müşteri bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(customer);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { name, debt } = await request.json();

  const index = customers.findIndex((c) => c.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Müşteri bulunamadı" }, { status: 404 });
  }

  customers[index] = { ...customers[index], name, debt };
  return NextResponse.json(customers[index]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const index = customers.findIndex((c) => c.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Müşteri bulunamadı" }, { status: 404 });
  }

  const deleted = customers.splice(index, 1);
  return NextResponse.json(deleted[0]);
}
