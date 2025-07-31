import { settlementsArgs } from "@/app/types";
import {createSettlement} from "@/lib/controllers/settlements";
import { NextResponse } from "next/server";

// getSettlementData;

export async function POST(req: Request) {
    try {
        const body: settlementsArgs = await req.json();
        const searchedContacts = await createSettlement(body);
        return NextResponse.json(searchedContacts); 
    } catch (err) {
        console.log(err);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
    }
}
