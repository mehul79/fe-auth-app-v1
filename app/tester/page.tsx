"use client"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Page(){
    const [data, setData] = useState("")

    useEffect(()=>{
        const inner = async()=>{
            try{
                const res = await axios.get("https://be-auth-app-v1.vercel.app/")
                setData(res.data)
                console.log(res.data);
            }catch(e){
                console.log(e);
            }
        }
        inner()
    }, [])

    return(
        <div className="text-white bg-black text-lg flex justify-center items-center h-screen">
            {data}
        </div>
    )
}