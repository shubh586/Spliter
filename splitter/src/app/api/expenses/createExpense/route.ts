

import { NextResponse } from "next/server";
import { createExpense } from "@/lib/controllers/expenses";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await createExpense(groupId);
    return NextResponse.json(data.selectedGroup);
  }  catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
