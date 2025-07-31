

import { NextResponse } from "next/server";
import { createExpense } from "@/lib/controllers/expenses";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await createExpense(body);
    return NextResponse.json(data);
  }  catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
