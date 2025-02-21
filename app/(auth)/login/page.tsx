"use client";
import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
          <AuthForm />
      </div>
    </div>
  );
}

function AuthForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleEmailLogin = async () => {
    try {
      setLoading(true);
      const response = await toast.promise(
        axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
          {
            email: formData.email,
            password: formData.password,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        ),
        {
          loading: "Logging in...",
          success: "Successfully logged in!",
          error: (err) => {
            if (err.response?.status === 401) {
              return "Invalid email or password.";
            } else if (err.response?.status === 400) {
              return "Please fill in all fields.";
            } else {
              return "Something went wrong. Please try again.";
            }
          },
        },
        {
          position: "bottom-right",
          style: { minWidth: "250px", marginBottom: "10px" },
        }
      );
      console.log("Response:", response.data);
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error:", error.response?.data || error.message);
      } else {
        console.error("Error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log("inside google login");
    try {
      const response = await toast.promise(
        axios.get("https://dummyjson.com/users/10"),
        {
          loading: "Logging in with Google...",
          success: "Successfully logged in!",
          error: "Login failed. Please try again.",
        },
        {
          position: "bottom-right",
          style: { minWidth: "250px", marginBottom: "10px" },
        }
      );

      console.log("Google login response:", response.data);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login in</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEmailLogin();
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-muted-foreground"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="###########"
                  className=""
                  required
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : "Login In"}
              </Button>
              <Toaster />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
              >
                Login In with Google
              </Button>
              <Toaster />
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
