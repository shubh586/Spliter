import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/controllers/storeduser";

export async function GET() {
    try {
        const currentUser = await getCurrentUser()
        return NextResponse.json(currentUser)
    } catch (err) {
        console.log(err)
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
    }
}

 