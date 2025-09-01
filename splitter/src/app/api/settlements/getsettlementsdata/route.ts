import { settlementsType } from "@/app/types";
import { getSettlementData } from "@/lib/controllers/settlements";
import { NextResponse } from "next/server";

// getSettlementData;

export async function POST(req: Request) {
    try {
        const body: settlementsType = await req.json();
                if (!body) {
                  return NextResponse.json(
                    { error: "settlements types required" },
                    { status: 400 }
                  );
                }
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
