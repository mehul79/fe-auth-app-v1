"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/magicui/terminal";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkLogged = async () => {
      try {
        // console.log("hi", process.env.NEXT_PUBLIC_BACKEND_URL);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/verifyuser`,
          {
            withCredentials: true
          }
        );

        if (response.status !== 200) {
          router.push("/login");
          return;
        }
        console.log(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Verification failed:", error);
        router.push("/login");
      }
    };
    checkLogged();
  }, [router]);

  const logout = async()=>{

    try {
      const response = await toast.promise(
        axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`,
          {},
          {
            withCredentials: true,
          }
        ),
        {
          loading: "Logging out...",
          success: "Successfully logged out!",
          error: (err) =>
            `Login failed: ${
              err.response?.data?.msg || "Something went wrong"
            }`,
        },
        {
          position: "bottom-right",
          style: { minWidth: "250px", marginBottom: "10px" },
        }
      );
      console.log("Response:", response.data);
      router.push("/login");
    } catch (e) {
      console.log("error logging out: ", e);
    }
    
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <TerminalDemo />
      <Button onClick={logout} className="mt-2">Logout</Button>
    </div>
  );
}



function TerminalDemo() {
  return (
    <Terminal>
      <TypingAnimation>&gt; pnpm dlx shadcn@latest init</TypingAnimation>
 
      <AnimatedSpan delay={1500} className="text-green-500">
        <span>✔ Preflight checks.</span>
      </AnimatedSpan>
 
      <AnimatedSpan delay={2000} className="text-green-500">
        <span>✔ Verifying framework. Found Next.js.</span>
      </AnimatedSpan>
 
      <AnimatedSpan delay={2500} className="text-green-500">
        <span>✔ Validating Tailwind CSS.</span>
      </AnimatedSpan>
 
      <AnimatedSpan delay={3000} className="text-green-500">
        <span>✔ Validating import alias.</span>
      </AnimatedSpan>
 
      <AnimatedSpan delay={3500} className="text-green-500">
        <span>✔ Writing components.json.</span>
      </AnimatedSpan>
 
      <AnimatedSpan delay={4000} className="text-green-500">
        <span>✔ Checking registry.</span>
      </AnimatedSpan>
 
      <AnimatedSpan delay={4500} className="text-green-500">
        <span>✔ Updating tailwind.config.ts</span>
      </AnimatedSpan>
 
      <AnimatedSpan delay={5000} className="text-green-500">
        <span>✔ Updating app/globals.css</span>
      </AnimatedSpan>
 
      <AnimatedSpan delay={5500} className="text-green-500">
        <span>✔ Installing dependencies.</span>
      </AnimatedSpan>
 
      <AnimatedSpan delay={6000} className="text-blue-500">
        <span>ℹ Updated 1 file:</span>
        <span className="pl-2">- lib/utils.ts</span>
      </AnimatedSpan>
 
      <TypingAnimation delay={6500} className="text-muted-foreground">
        Success! Virus initialization completed.
      </TypingAnimation>
 
      <TypingAnimation delay={7000} className="text-muted-foreground">
        You may now fu**ing logout.
      </TypingAnimation>
    </Terminal>
  );
}