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
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

// Define form schema
const formSchema = z
  .object({
    password: z.string().min(4, "Password must be at least 4 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function EnterPassword() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [isLoading, setLoading] = useState(false);
  const params = useParams();
  const resetCryptokey = params.cryptokey;
  console.log(resetCryptokey);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await toast.promise(
        axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/reset-password/${resetCryptokey}`,
          {
            password: values.password,
          }
        ),
        {
          loading: "Resetting password...",
          success: "Password reset successfully!",
          error: (err) => {
            if (err.response?.data?.message) {
              return `Error: ${err.response.data.message}`;
            }
            return "Failed to reset password. Please try again.";
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/");
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
              Set New Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your new password and confirm it to reset.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="New password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Reset Password"}
              </Button>
              <Toaster />
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
