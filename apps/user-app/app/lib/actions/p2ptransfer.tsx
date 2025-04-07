"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";




export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
        return {
            success: false,
            message: "User not Authenticated"
        }
    }
    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });

    if (!toUser) {
      return {
        success: false,
        message: "user not found"
      }
    }
    try {
      await prisma.$transaction(async (tx: any) => {
          await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId"=${Number(from)} FOR UPDATE`
  
          const fromBalance = await tx.balance.findUnique({
              where: { userId: Number(from) },
            });
            if (!fromBalance || fromBalance.amount < amount) {
              return {
                errorCode: 3,
                message: "Insufficient Funds!"
              }
            }
  
            await tx.balance.update({
              where: { userId: Number(from) },
              data: { amount: { decrement: amount } },
            });
  
            await tx.balance.update({
              where: { userId: toUser.id },
              data: { amount: { increment: amount } },
            });
  
            await tx.p2pTransfer.create({
              data:{
                  fromUserId: Number(from),
                  toUserId: toUser.id,
                  timestamp: new Date(),
                  amount: amount
              }
            })
      });

      return{
        success: true,
        errorCode: 5,
        message: "The transaction is successful"
      }
    } catch (error) {
      return {
        success: false,
        errorCode: 4,
        message: "Something went wrong when transaction is happening"
      }
      
    }
}