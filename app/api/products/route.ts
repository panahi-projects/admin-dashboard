// @/app/api/products/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // This is a public route, no authentication needed
  const products = [
    { id: 1, name: "Product 1", price: 10.99 },
    { id: 2, name: "Product 2", price: 19.99 },
    { id: 3, name: "Product 3", price: 7.99 },
  ];

  return NextResponse.json(products);
}
