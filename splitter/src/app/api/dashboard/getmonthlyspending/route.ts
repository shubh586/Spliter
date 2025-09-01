import { getMonthlySpending } from "@/lib/controllers/dashboard";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: { userId: string } = await req.json();
        if (!body.userId) {
          return NextResponse.json(
            { error: "User ID is required" },
            { status: 400 }
          );
        }
    console.log("Monthly Spending API called with userId:", body.userId);
    
    const monthlyExpenses = await getMonthlySpending(body.userId);
    console.log("Monthly Spending API returned:", {
      data: monthlyExpenses,
      type: typeof monthlyExpenses,
      isArray: Array.isArray(monthlyExpenses),
      length: monthlyExpenses?.length,
      sampleData: monthlyExpenses?.[0]
    });
    
    return NextResponse.json(monthlyExpenses);
  } catch (err) {
    console.log("Monthly Spending API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
