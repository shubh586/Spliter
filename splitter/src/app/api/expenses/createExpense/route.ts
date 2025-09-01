import { NextResponse } from "next/server";
import { createExpense } from "@/lib/controllers/expenses";

export async function POST(req: Request) {
  try {
    const body = await req.json();
            if (!body) {
              return NextResponse.json(
                { error: "expenses data  required" },
                { status: 400 }
              );
            }
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
