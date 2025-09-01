import { searchALlContacts } from "@/lib/controllers/storeduser";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const body:{query:string} = await req.json();
                if (!body.query && body.query.length<2) {
                  return NextResponse.json(
                    { error: "query length must more than 2" },
                    { status: 400 }
                  );
                }
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