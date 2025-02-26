"use client";
import type React from "react";
import { z } from "zod";
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
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form schema
const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 8 characters"),
});

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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleEmailLogin = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      // console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
      const response = await toast.promise(
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/signup`, values, {
          withCredentials: true,
        }),
        {
          loading: "Signing up...",
          success: "Successfully signed up!",
          error: (err) => {
            if (err.response?.data?.error?.[0]?.message) {
              return `Sign up failed: ${err.response.data.error[0].message}`;
            }
            if (err.response?.data) {
              return `Sign up failed: ${err.response.data}`;
            }
            return "Sign up failed: Something went wrong";
          },
        },
        {
          position: "bottom-right",
          style: { minWidth: "250px", marginBottom: "10px" },
        }
      );
      console.log("Response:", response.data);
      router.push("/otp");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error:", error.response?.data || error.message);
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

  // console.log(formData);

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleEmailLogin)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : "Sign Up"}
              </Button>
              <Toaster />
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
              >
                Sign Up with Google
              </Button>
              <Toaster />
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
