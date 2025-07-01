import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"


export const storeduser=async()=>{
   const user =await currentUser()
   if(!user){
    return {
        error:"unauthentucated",
        status:401
    }
   }
   const storeduser=await prisma.user.findUnique({
    where:{clerkId:user.id}
   })

   if(!storeduser){
    await prisma.user.create({
        data:{
            clerkId:user.id,
            name:user.firstName??"nonbiologicalhuman",
            email:user.emailAddresses[0]?.emailAddress ?? "",
        }
    })
   }
   return {status:200}
}