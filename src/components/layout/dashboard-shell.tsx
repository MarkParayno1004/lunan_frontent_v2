"use client";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { useCurrentRole } from "@/features/auth/hooks/use-current-role";

type DashboardShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function DashboardShell({ children }: DashboardShellProps) {
  const role = useCurrentRole();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-zinc-100 p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row">
        <DashboardSidebar role={role} />
        <div className="flex-1 rounded-2xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
