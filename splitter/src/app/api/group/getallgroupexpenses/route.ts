import { NextResponse } from "next/server";
import { getGroupExpenses } from "@/lib/controllers/group";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const groupId: string = body.groupId;
            if (!groupId) {
              return NextResponse.json(
                { error: "groupId is required" },
                { status: 400 }
              );
            }
    const data = await getGroupExpenses(groupId);
    return NextResponse.json(data);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
