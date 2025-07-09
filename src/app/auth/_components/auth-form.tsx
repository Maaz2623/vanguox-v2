"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { SetStateAction, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

export function AuthForm() {
  const [formType, setFormType] = useState<"login" | "signup">("login");

  const [loading, setLoading] = useState(false);

  return (
    <div
      className={cn("flex flex-col gap-6 justify-center items-center w-full")}
    >
      <fieldset disabled={loading}>
        {formType === "login" ? (
          <LoginForm setLoading={setLoading} setFormType={setFormType} />
        ) : (
          <SignUpForm setLoading={setLoading} setFormType={setFormType} />
        )}
      </fieldset>
    </div>
  );
}

const LoginForm = ({
  setFormType,
  setLoading,
}: {
  setLoading: (loading: boolean) => void;
  setFormType: React.Dispatch<SetStateAction<"login" | "signup">>;
}) => {
  const router = useRouter();

  const formSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Enter a valid email address" }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(64, { message: "Password must be at most 64 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must include at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must include at least one lowercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must include at least one number",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must include at least one special character",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          form.reset();
          router.push(`/`);
        },
        onError: (error) => {
          toast.error(error.error.message, {
            position: "top-center",
            style: {
              color: "red",
            },
          });
          setLoading(false);
        },
      }
    );
  };

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="grid p-0 md:grid-cols-2">
        <Form {...form}>
          <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Acme Inc account
                </p>
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className=""
                          placeholder="johndoe@mail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="****"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="flex">
                <Button
                  onClick={async () => {
                    setLoading(true);
                    await authClient.signIn.social(
                      {
                        provider: "google",
                      },
                      {
                        onRequest: () => {
                          setLoading(true);
                        },
                      }
                    );
                  }}
                  variant="outline"
                  type="button"
                  className="w-full"
                >
                  <FaGoogle />
                  <span>Login with Google</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Button
                  type="button"
                  variant={`link`}
                  onClick={() => setFormType("signup")}
                  className="underline underline-offset-4 text-white cursor-pointer"
                  size={`sm`}
                >
                  Sign up
                </Button>
              </div>
            </div>
          </form>
        </Form>
        <div className="bg-muted relative hidden md:block">
          <Image
            src="/logo.svg"
            alt="Image"
            width={1000}
            height={1000}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const SignUpForm = ({
  setFormType,
  setLoading,
}: {
  setFormType: React.Dispatch<SetStateAction<"login" | "signup">>;
  setLoading: (loading: boolean) => void;
}) => {
  const router = useRouter();

  const formSchema = z
    .object({
      name: z.string().min(1, {
        message: "Name is required",
      }),
      email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Enter a valid email address" }),

      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(64, { message: "Password must be at most 64 characters long" })
        .regex(/[A-Z]/, {
          message: "Password must include at least one uppercase letter",
        })
        .regex(/[a-z]/, {
          message: "Password must include at least one lowercase letter",
        })
        .regex(/[0-9]/, {
          message: "Password must include at least one number",
        })
        .regex(/[^A-Za-z0-9]/, {
          message: "Password must include at least one special character",
        }),

      confirmPassword: z.string().min(1, {
        message: "Please confirm your password",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"], // set error on confirmPassword field
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          form.reset();
          router.push(`/`);
        },
        onError: (error) => {
          toast.error(error.error.message, {
            position: "top-center",
            style: {
              color: "red",
            },
          });
          setLoading(false);
        },
      }
    );
  };

  return (
    <Card className="overflow-hidden p-0 w-[70%] mx-auto">
      <CardContent className="grid p-0 md:grid-cols-2">
        <Form {...form}>
          <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome</h1>
                <p className="text-muted-foreground text-balance">
                  Create your account
                </p>
              </div>
              <div className="h-full flex flex-col space-y-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className=" p-1">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          className=""
                          placeholder="johndoe@mail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="p-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className=""
                          placeholder="johndoe@mail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <div className="flex">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="p-1">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            className=""
                            placeholder="*******"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />{" "}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="p-1">
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            className=""
                            placeholder="********"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="flex">
                <Button
                  onClick={async () => {
                    setLoading(true);
                    await authClient.signIn.social(
                      {
                        provider: "google",
                      },
                      {
                        onRequest: () => {
                          setLoading(true);
                        },
                      }
                    );
                  }}
                  variant="outline"
                  type="button"
                  className="w-full"
                >
                  <FaGoogle />
                  <span>Login with Google</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Button
                  onClick={() => setFormType("login")}
                  type="button"
                  variant={`link`}
                  className="underline underline-offset-4 text-white cursor-pointer"
                  size={`sm`}
                >
                  Sign in
                </Button>
              </div>
            </div>
          </form>
        </Form>
        <div className="bg-muted relative hidden md:block">
          <Image
            src="/logo.svg"
            alt="Image"
            width={1000}
            height={1000}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
};
