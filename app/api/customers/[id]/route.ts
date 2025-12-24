import { customers } from "@/app/mock/customers";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return NextResponse.json({ error: "Müşteri bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(customer);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { debt, personCount, product } = await request.json();

  const index = customers.findIndex((c) => c.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Müşteri bulunamadı" }, { status: 404 });
  }
  console.log(customers[index]);
  customers[index] = {
    ...customers[index],
    debt: debt ?? customers[index].debt,
    personCount: personCount ?? customers[index].personCount,
    product: product ?? customers[index].product,
  };
  console.log(customers[index]);
  return NextResponse.json(customers[index]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = customers.findIndex((c) => c.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Müşteri bulunamadı" }, { status: 404 });
  }

  const deleted = customers.splice(index, 1);
  return NextResponse.json(deleted[0]);
}
