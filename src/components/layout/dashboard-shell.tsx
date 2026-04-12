"use client";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { useCurrentRole } from "@/features/auth/hooks/use-current-role";
import { FloatingChatWidget, Counselor } from "@/components/shared";

type DashboardShellProps = Readonly<{
  children: React.ReactNode;
}>;

const MOCK_COUNSELORS: Counselor[] = [
  {
    id: "c1",
    name: "Dr. Sarah Wilson",
    specialty: "Cognitive Behavioral Therapy",
    status: "Online",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "c2",
    name: "Dr. Michael Chen",
    specialty: "Family Counseling",
    status: "Away",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    id: "c3",
    name: "Dr. Elena Rodriguez",
    specialty: "Trauma Specialist",
    status: "Online",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
  },
];

export function DashboardShell({ children }: DashboardShellProps) {
  const role = useCurrentRole();

  // Map user roles to chat widget requirements
  const chatRole = role === "PATIENT" ? "patient" : role === "COUNSELOR" ? "doctor" : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-zinc-100 p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row">
        <DashboardSidebar role={role} />
        <div className="flex-1 rounded-2xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur sm:p-6">
          {children}
        </div>
      </div>

      {chatRole && (
        <FloatingChatWidget
          role={chatRole}
          counselors={MOCK_COUNSELORS}
          initialMessages={[
            {
              id: "1",
              text: "Hello! How can I help you today?",
              sender: "them",
              timestamp: "10:00 AM",
            },
          ]}
        />
      )}
    </div>
  );
}
