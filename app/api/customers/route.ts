import { NextResponse } from "next/server";
import { Customer } from "@/app/models/index";

const customers: Customer[] = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" },
];

export async function GET() {
  return NextResponse.json(customers);
}

export async function POST(request: Request) {
  const newCustomer = (await request.json()) as Customer;
  customers.push(newCustomer);
  return NextResponse.json(newCustomer, { status: 201 });
}
