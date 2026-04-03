import Link from "next/link";
import { ArrowRight, HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-16 sm:px-10">
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            <HeartPulse className="h-3.5 w-3.5" />
            Lunan Healthcare Platform
          </div>
          <h1 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
            Modern counseling and patient care, in one dashboard.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-600 sm:text-lg">
            Coordinate diagnostics, assignments, and prescriptions with secure
            role-based workflows for patients, counselors, and administrators.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-xl border border-zinc-200 bg-white p-5">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            <h2 className="mt-3 text-sm font-semibold">Diagnostics Tracking</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Record and review patient diagnostics with clear counselor
              ownership.
            </p>
          </article>
          <article className="rounded-xl border border-zinc-200 bg-white p-5">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="mt-3 text-sm font-semibold">Role-Based Access</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Separate views and actions for patients, counselors, and admins.
            </p>
          </article>
          <article className="rounded-xl border border-zinc-200 bg-white p-5">
            <HeartPulse className="h-5 w-5 text-rose-600" />
            <h2 className="mt-3 text-sm font-semibold">Care Assignments</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Keep assignments and prescription status visible throughout
              treatment.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
