"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginPage() {
  const year = new Date().getFullYear();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });

      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
      } else if (result?.ok) {
        toast.success("Login successful! Redirecting...");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col items-center justify-between p-8 sm:p-12">
        <div className="w-full">
          <Link href="/">
            <Image
              src="/images/muvment.png"
              alt="Muvment Admin Logo"
              width={140}
              height={30}
              priority
            />
          </Link>
        </div>

        <div className="w-full max-w-sm">
          <h1 className="mb-8 text-left text-3xl font-bold tracking-tight text-gray-900">
            Log In
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email">Email*</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#000000] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#0096FF] focus:border-none"
              />
            </div>
            <div>
              <label htmlFor="password">Password*</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#000000] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#0096FF] focus:border-none"
              />
            </div>
            {error && (
              <p className="text-center text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center border border-transparent bg-[#1F51FF] py-3 px-4 font-semibold text-white hover:bg-[#0096FF] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>

        <div className="w-full">
          <p className="text-medium text-black">© {year} Muvment</p>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Image
          src="/images/login_bg.png"
          alt="Muvment Login Background"
          fill={true}
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
    </div>
  );
}
