import express from "express";
import db from "@repo/db/client";
const app = express(); 
import cors from "cors"

app.use(express.json())
app.use(cors())
app.post("/hdfcWebhook", async (req, res) => {
    //TODO: Add zod validation here?
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };


    const onRampTxn = await db.onRampTransaction.findFirst({
        where:{
            token: paymentInformation.token
        }
    })

   if(onRampTxn?.status === "Success"){
    return res.status(200).json({
        message: "Transaction successfull",
        token: paymentInformation.token
    }) 
   }

    try {
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                }, 
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})

app.listen(3003, ()=>{
    console.log("Bank webhook is listening at 3003")
});