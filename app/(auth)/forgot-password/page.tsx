"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
import * as z from "zod";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// Define form schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPassword() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isLoading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    try {
      setLoading(true);
      const response = await toast.promise(
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/forgot-password`, {
          email: values.email,
        }),
        {
          loading: "Sending password reset email...",
          success: "Password reset email sent successfully!",
          error: (err) => {
            if (err.response?.data?.message) {
              return `Error: ${err.response.data.message}`;
            }
            return "Failed to send password reset email. Please try again.";
          },
        },
        {
          position: "bottom-right",
          style: {
            minWidth: "250px",
            marginBottom: "10px",
          },
        }
      );
      console.log(response.data);
      // Wait for 2 seconds after the toast completes
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
        <Card className="p-6">
          <div className="mb-2 flex flex-col space-y-2 text-left">
            <h1 className="text-md font-semibold tracking-tight">
              Forgot Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your registered email and <br /> we will send you a link to
              reset your password.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Continue"}
              </Button>
              <Toaster />
              <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
                .
              </p>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
