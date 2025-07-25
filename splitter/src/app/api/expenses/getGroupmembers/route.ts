export const runtime = "nodejs"; // Important for Prisma compatibility

import { NextResponse } from "next/server";
import { getGroupMembersWithId } from "@/lib/controllers/group";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const groupId = body.groupId;

    if (!groupId) {
      return NextResponse.json({ error: "Missing groupId" }, { status: 400 });
    }

    const data = await getGroupMembersWithId(groupId);
    return NextResponse.json(data.selectedGroup);
  }  catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
