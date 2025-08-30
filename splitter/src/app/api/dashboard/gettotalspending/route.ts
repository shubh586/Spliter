import { getTotalSpent } from "@/lib/controllers/dashboard";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: { userId: string } = await req.json();
    // console.log("Total Spending API called with userId:", body.userId);
    
    const totalExpenses = await getTotalSpent(body.userId);
    // console.log("Total Spending API returned:", totalExpenses);
    
    return NextResponse.json(totalExpenses);
  } catch (err) {
    console.log("Total Spending API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
