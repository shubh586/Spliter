import { getUserBalances } from "@/lib/controllers/dashboard";
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
    const userExpenses = await getUserBalances(
      body.userId
    );
    return NextResponse.json(userExpenses);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
