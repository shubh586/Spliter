import { NextResponse } from "next/server";
import { getGroupsWithORWirhoutMemebrs } from "@/lib/controllers/group";

export async function GET() {
  try {
    const data = await getGroupsWithORWirhoutMemebrs(); 
    return NextResponse.json(data.groups);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}