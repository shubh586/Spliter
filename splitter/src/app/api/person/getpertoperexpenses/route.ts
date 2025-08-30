import { getExpensesBetweenUsers } from "@/lib/controllers/person";
import { NextResponse } from "next/server";
import type { oneToOneExpenses } from "@/app/types";

export async function POST(req: Request) {
  try {
    const body: { userId: string } = await req.json();
    // console.log("Person API called with userId:", body.userId);
    
    const personalExpense: oneToOneExpenses = await getExpensesBetweenUsers(body.userId);
    // console.log("Person API returned successfully");
    
    return NextResponse.json(personalExpense);
  } catch (err) {
    console.log("Person API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
