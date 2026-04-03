import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";

type DashboardLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    notFound();
  }

  return <DashboardShell>{children}</DashboardShell>;
}
