import {storeduser} from "@/lib/controllers/storeduser"
import { NextResponse } from "next/server"
export const runtime = 'nodejs'
export const POST =async()=>{
    const result=await storeduser()
    if(result.error){
        return NextResponse.json({error:result.error},{status:result.status})
    }
    return NextResponse.json({status:"ok"},{status:200})
}
//NextResponse.json(body, options)
