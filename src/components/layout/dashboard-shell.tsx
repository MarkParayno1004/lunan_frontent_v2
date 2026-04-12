"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { useCurrentRole } from "@/features/auth/hooks/use-current-role";
import { FloatingChatWidget, Counselor } from "@/components/shared";
import { useQuery } from "@apollo/client/react";
import { CHAT_USERS_QUERY } from "@/features/dashboard/graphql";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";

type DashboardShellProps = Readonly<{
  children: React.ReactNode;
}>;

interface ChatUsersData {
  counselors: Array<{
    id: string;
    specialization: string;
    licenseNo: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      contactNo: string;
    };
  }>;
  patients: Array<{
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      contactNo: string;
    };
  }>;
  users: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }>;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const role = useCurrentRole();
  const [debugRole, setDebugRole] = useState<string | null>(null);
  
  const { data, loading, error } = useQuery<ChatUsersData>(CHAT_USERS_QUERY);

  // Map user roles to chat widget requirements
  const effectiveRole = debugRole || role;
  
  console.log("DashboardShell Debug:", { role, debugRole, effectiveRole, data, loading, error });

  const chatRole = effectiveRole === "PATIENT" ? "patient" : effectiveRole === "COUNSELOR" ? "doctor" : null;

  // Logic: 
  // If I am a PATIENT, I want to see COUNSELORS.
  // If I am a COUNSELOR, I want to see PATIENTS.
  const chatUsers: Counselor[] = React.useMemo(() => {
    if (!data) return [];
    
    if (effectiveRole === "PATIENT") {
      // Primary source: counselors table
      if (data.counselors && data.counselors.length > 0) {
        return data.counselors.map((c) => ({
          id: c.id,
          name: `${c.user.firstName} ${c.user.lastName}`,
          specialty: c.specialization,
          status: "Online",
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user.firstName}`,
          userEmail: c.user.email,
          userId: c.user.id
        }));
      }
      // Fallback: users table by role
      return data.users.filter(u => u.role === "COUNSELOR").map(u => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        specialty: "Counselor",
        status: "Online",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.firstName}`,
        userEmail: u.email,
        userId: u.id
      }));
    } 
    
    if (effectiveRole === "COUNSELOR") {
      // Primary source: patients table
      if (data.patients && data.patients.length > 0) {
        return data.patients.map((p) => ({
          id: p.id,
          name: `${p.user.firstName} ${p.user.lastName}`,
          specialty: "Patient",
          status: "Online",
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.user.firstName}`,
          userEmail: p.user.email,
          userId: p.user.id
        }));
      }
      // Fallback: users table by role
      return data.users.filter(u => u.role === "PATIENT").map(u => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        specialty: "Patient",
        status: "Online",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.firstName}`,
        userEmail: u.email,
        userId: u.id
      }));
    }

    return [];
  }, [data, effectiveRole]);

  const toggleDebugRole = () => {
    if (!debugRole) {
      setDebugRole(role === "PATIENT" ? "COUNSELOR" : "PATIENT");
    } else {
      setDebugRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-zinc-100 p-4 sm:p-6">
      {/* Debug Switcher */}
      <div className="fixed top-4 right-4 z-[60] flex items-center gap-2 rounded-full border bg-white/80 p-1 pl-4 shadow-lg backdrop-blur">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Dev Mode: {effectiveRole}
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleDebugRole}
          className="h-8 w-8 rounded-full p-0"
        >
          <RefreshCw className={cn("h-4 w-4", debugRole && "text-blue-500")} />
        </Button>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row">
        <DashboardSidebar role={effectiveRole} />
        <div className="flex-1 rounded-2xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur sm:p-6">
          {children}
        </div>
      </div>

      {chatRole && (
        <FloatingChatWidget
          role={chatRole}
          counselors={chatUsers}
        />
      )}
    </div>
  );
}
