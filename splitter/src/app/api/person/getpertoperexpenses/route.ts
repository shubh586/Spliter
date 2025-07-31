import { getExpensesBetweenUsers } from "@/lib/controllers/person";
import { NextResponse } from "next/server";
import type { oneToOneExpenses } from "@/app/types";
export async function POST(req: Request) {
  try {
    const body: { userId: string } = await req.json();
    const personalExpense: oneToOneExpenses = await getExpensesBetweenUsers(
      body.userId
    );
    return NextResponse.json(personalExpense);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
