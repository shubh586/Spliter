import { settlementsType } from "@/app/types";
import { getSettlementData } from "@/lib/controllers/settlements";
import { NextResponse } from "next/server";

// getSettlementData;

export async function POST(req: Request) {
    try {
        const body: settlementsType = await req.json();
        const searchedContacts = await getSettlementData(body);
        return NextResponse.json(searchedContacts); 
    } catch (err) {
        console.log(err);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
    }
}
