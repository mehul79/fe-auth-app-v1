"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";
import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter  } from "next/navigation";

export default function page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Otp />
    </div>
  );
}




function Otp() {
  const [code, setCode] = useState<string>()
  const router = useRouter()

  async function onClickHandler(){
    console.log("validation otp");
  
    try{
      const responce = await toast.promise(
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/verify-email`, {
          code: code
        }),
        {
          loading: "Verifiying OTP",
          success: "Successfully verfied your account!",
          error: (err) =>
            `Verification failed: ${
              err.response?.data?.msg || "Something went wrong"
            }`,
        },
        {
          position: "bottom-right",
          style: { minWidth: "250px", marginBottom: "10px" },
        }
      )
      router.push("/")
      console.log(responce);
    }catch(e){
      console.log("error: ", e);
    } 
  }



  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
        <CardDescription>
          Introduce the 4-digit verification code sent to {}{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div>
            <div className="flex space-y-1.5 ">
              <InputOTP maxLength={6} value={code} onChange={(value) => setCode(value)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center ">
        <Button className="w-full" onClick={onClickHandler}>Deploy</Button>
        <Toaster />
      </CardFooter>
    </Card>
  );
}
