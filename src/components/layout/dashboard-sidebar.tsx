"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, FileText, LayoutDashboard, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarRole = "PATIENT" | "COUNSELOR" | "ADMIN";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navByRole: Record<SidebarRole, NavItem[]> = {
  COUNSELOR: [
    { href: "/dashboard/counselor", label: "My Patients", icon: Users },
    { href: "/dashboard/counselor", label: "Assignments", icon: ClipboardList },
    { href: "/dashboard/counselor", label: "Diagnostic Logs", icon: FileText },
  ],
  PATIENT: [
    { href: "/dashboard/patient", label: "Medical Records", icon: FileText },
    { href: "/dashboard/patient", label: "Prescriptions", icon: FileText },
    { href: "/dashboard/patient", label: "Assignments", icon: FileText },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  ],
};

type DashboardSidebarProps = {
  role: string | null;
};

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const normalizedRole = (role ?? "PATIENT") as SidebarRole;
  const links = navByRole[normalizedRole] ?? navByRole.PATIENT;

  return (
    <aside className="w-full rounded-2xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur md:w-64">
      <div className="mb-4 px-2">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Lunan
        </p>
        <p className="text-sm font-semibold text-zinc-900">
          {normalizedRole.toLowerCase()} portal
        </p>
      </div>
      <nav className="space-y-1.5">
        {links.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-700 hover:bg-zinc-100",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
