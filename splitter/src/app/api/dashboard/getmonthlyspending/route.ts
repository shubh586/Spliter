import { getMonthlySpending } from "@/lib/controllers/dashboard";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: { userId: string } = await req.json();
    const monthlyExpenses = await getMonthlySpending(
      body.userId
    );
    return NextResponse.json(monthlyExpenses);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
