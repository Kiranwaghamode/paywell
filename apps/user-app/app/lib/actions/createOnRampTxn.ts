"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnRampTransaction(provider: string, amount: number){
    const session = await getServerSession(authOptions)


    if(!session?.user || !session?.user?.id){
        return {
            message: "Unauthenticated User"
        }
    }
    const userId = Number(session?.user?.id)
    const token = (Math.random() * 1000).toString();

  

    const onRampToken = await prisma.onRampTransaction.create({
        data:{
            status: "Processing",
            token,
            provider,
            amount,
            userId,
            startTime: new Date()
        }

    })

    return {
        token: onRampToken?.token,
        message: "Done"
    }
}