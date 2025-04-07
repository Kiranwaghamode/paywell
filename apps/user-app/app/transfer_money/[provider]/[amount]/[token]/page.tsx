"use client";


import { useParams } from "next/navigation"
import MoneyRequestCard from "../../../../../components/MoneyRequestCard";




export default function () {
    const params = useParams()

    //@ts-ignore
    const amount = Number(decodeURIComponent(params.amount)) 
    //@ts-ignore
    const provider = decodeURIComponent(params.provider) 
    //@ts-ignore
    const token = decodeURIComponent(params.token) 

    return <>
    <div className="w-[400px] border-2 border-black rounded-xl h-[300px] mx-auto my-auto flex items-center justify-center gap-[] mt-[100px]">
    <MoneyRequestCard amount={amount} provider={provider} token={token}/>
    </div>
    
    </>
}