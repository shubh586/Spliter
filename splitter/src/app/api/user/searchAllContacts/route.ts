import { searchALlContacts } from "@/lib/controllers/storeduser";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const searchedContacts = await searchALlContacts(body.query);
        return NextResponse.json(searchedContacts); 
    } catch (err) {
        console.log(err);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
    }
}