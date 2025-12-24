import { NextResponse, NextRequest } from "next/server";
import { Customer } from "@/app/types/index";
import { customers } from "@/app/mock/customers";

export async function GET() {
  return NextResponse.json(customers);
}

export async function POST(request: NextRequest) {
  const { name, debt } = await request.json();
  const newCustomer: Customer = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    debt: debt || 0,
    personCount: 0,
    product: "",
  };
  customers.push(newCustomer);
  return NextResponse.json(newCustomer, { status: 201 });
}
