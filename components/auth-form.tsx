"use client"
import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast";

interface AuthFormProps extends React.ComponentPropsWithoutRef<"div"> {
  mode?: "login" | "signup"
}

export function AuthForm({ mode = "login", className, ...props }: AuthFormProps) {
  const isLogin = mode === "login"

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
})
  const [loading, setLoading] = useState<boolean>(false)

  //handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Wrap the entire async operation in toast.promise
      const response = await toast.promise(
        axios.post("http://localhost:5001/api/auth/login", {
          email: formData.email,
          password: formData.password,
        }, {
          withCredentials: true,
        }),
        {
          loading: 'Logging in...',
          success: 'Successfully logged in!',
          error: (err) => `Login failed: ${err.response?.data?.message || 'Something went wrong'}`,
        },
        {
          position: "bottom-right",
          style: {
            minWidth: '250px',
            marginBottom: "10px"
          }
        }
      );
  
      console.log("Response:", response.data);
      setLoading(false);
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error:", error.response?.data || error.message);
      } else {
        console.error("Error:", error);
      }
      setLoading(false);
    }
  };
  
  

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{isLogin ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isLogin ? "Enter your email below to login to your account" : "Create an account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e)=>{e.preventDefault(); handleSubmit();}}>
            <div className="flex flex-col gap-6">
              {!isLogin && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" placeholder="John Doe" required onChange={handleChange}/>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required onChange={handleChange}/>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" >Password</Label>
                  {isLogin && (
                    <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                      Forgot your password?
                    </a>
                  )}
                </div>
                <Input id="password" type="password" required onChange={handleChange}/>
              </div>
              {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
              </Button>
              {/* <Toaster /> */}
              

              <Button variant="outline" className="w-full">
                {isLogin ? "Login" : "Sign Up"} with Google
              </Button>
              <Toaster />

            </div>
            <div className="mt-4 text-center text-sm">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{" "}
                  <a href="/signup" className="underline underline-offset-4">
                    Sign up
                  </a>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <a href="/login" className="underline underline-offset-4">
                    Login
                  </a>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}



