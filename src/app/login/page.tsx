 "use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { LockKeyhole, Mail } from "lucide-react";
import { useLogin } from "@/features/auth/hooks/use-login";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await login(email, password);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Sign in to Lunan</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Use your credentials to access your dashboard.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-800">
              Email
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3">
              <Mail className="h-4 w-4 text-zinc-500" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-zinc-800">
              Password
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3">
              <LockKeyhole className="h-4 w-4 text-zinc-500" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
              />
            </div>
          </div>

          {error ? <p className="text-sm text-red-600">Login failed. Please check your credentials.</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-zinc-600">
          Return to{" "}
          <Link href="/" className="font-medium text-zinc-900 hover:underline">
            landing page
          </Link>
        </div>
      </section>
    </main>
  );
}
