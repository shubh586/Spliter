import { getMonthlySpending } from "@/lib/controllers/dashboard";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: { userId: string } = await req.json();
    // console.log("Monthly Spending API called with userId:", body.userId);
    
    const monthlyExpenses = await getMonthlySpending(body.userId);
    // console.log("Monthly Spending API returned:", monthlyExpenses);
    
    return NextResponse.json(monthlyExpenses);
  } catch (err) {
    console.log("Monthly Spending API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
