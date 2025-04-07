"use client"

import React, { useEffect, useState } from 'react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'




const MoneyRequestCard = ({amount, provider, token}:{
    amount: number,
    provider: string,
    token: string
}) => {

    const router = useRouter()

    const [userId , setUserId] = useState("")

    useEffect(()=>{
      const fetchSession =async () =>{
        const session = await getSession()
        //@ts-ignore
        setUserId(session?.user?.id)
      }
      fetchSession()
    },[])

    const handleWebHook =async () =>{
      const res = await fetch('http://localhost:3003/hdfcWebhook', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100,
          user_identifier:userId,
          token: token
        })
      })

      if(res.status === 200){
        alert("your transaction is successsful!")
        router.push('/transfer')
      }else{
        alert("Something went wrong!")
      }
    }

   



  return (
    <>
    <div className='flex items-center justify-center flex-col '>
        <h1 className='font-bold text-2xl '>Payment Request</h1>
        <h1 className='text-xl'>{provider}</h1>
        <h2 className='font-bold'>{amount} RS</h2>

        <button onClick={handleWebHook} className='font-bold text-2xl shadow-xl/3 border-2 border-black px-10 rounded-lg bg-blue-400 text-white'>PAY</button>
    </div>
    </>
  )
}

export default MoneyRequestCard