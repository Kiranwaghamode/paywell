"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { Select } from "@repo/ui/select";
import { useEffect, useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createOnRampTransaction } from "../app/lib/actions/createOnRampTxn";
import { useRouter } from "next/navigation";
import { Noto_Sans_Adlam_Unjoined } from "next/font/google";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];



export const AddMoney = () => {
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "")
    const [amount, setAmount] = useState(0)
    const [token , setToken ]= useState('')
    const router = useRouter()

    const handleAddMoney = async ()=>{
        const returnObj =  await createOnRampTransaction(provider, amount * 100)

        console.log(returnObj)
        if(returnObj?.token){
            setToken(String(returnObj.token))
            console.log(token)
        }
        // window.location.href = redirectUrl || "";
        

        return null

    }
    useEffect(()=>{
        if(token.length){
            console.log("This is first time")
    
            return router.push(`/transfer_money/${provider}/${amount}/${token}`)
                
            }
    }, [token])


    return <Card title="Add Money">
    <div className="w-full">
        <TextInput type={"number"}label={"Amount"} placeholder={"Amount"} onChange={(value) => {
            setAmount(Number(value))
        }} />
        <div className="py-4 text-left">
            Bank
        </div>
        <Select onSelect={(value) => {
            setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "")
            setProvider(SUPPORTED_BANKS.find(x => x.name === value)?.name || "");
        }} options={SUPPORTED_BANKS.map(x => ({
            key: x.name,
            value: x.name
        }))} />
        <div className="flex justify-center pt-4">
            <Button onClick={handleAddMoney}>
            Add Money
            </Button>
        </div>
    </div>
</Card>
}