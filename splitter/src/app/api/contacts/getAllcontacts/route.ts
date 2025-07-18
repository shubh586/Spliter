import { NextResponse } from "next/server";
import { getAllContacts } from "@/lib/controllers/contacts";

export async function GET() {
  try {
    const data = await getAllContacts(); 
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
