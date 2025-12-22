import { NextResponse } from "next/server";
import { Order } from "@/app/models/index";

const orders: Order[] = [
  { id: "101", customerId: "1", amount: 250, date: "2024-01-15" },
  { id: "102", customerId: "2", amount: 450, date: "2024-02-20" },
  { id: "103", customerId: "1", amount: 150, date: "2024-03-10" },
];

export async function GET() {
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const newOrder = (await request.json()) as Order;
  orders.push(newOrder);
  return NextResponse.json(newOrder, { status: 201 });
}
