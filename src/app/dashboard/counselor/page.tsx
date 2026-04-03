"use client";

import { useQuery } from "@apollo/client/react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ASSIGNMENTS_QUERY } from "@/features/assignments/graphql";
import { DIAGNOSTICS_QUERY } from "@/features/diagnostics/graphql";
import { AssignmentStatusBadge } from "@/features/assignments/components/assignment-status-badge";
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";

type AssignmentItem = {
  id: string;
  task: string;
  status: string;
  patient: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
};

type DiagnosticItem = {
  id: string;
};

type AssignmentsData = {
  assignments: AssignmentItem[] | null;
};

type DiagnosticsData = {
  diagnostics: DiagnosticItem[] | null;
};

export default function CounselorDashboardPage() {
  const { data: assignmentsData, loading: loadingAssignments } = useQuery<AssignmentsData>(ASSIGNMENTS_QUERY);
  const { data: diagnosticsData, loading: loadingDiagnostics } = useQuery<DiagnosticsData>(DIAGNOSTICS_QUERY);

  if (loadingAssignments || loadingDiagnostics) {
    return <DashboardSkeleton />;
  }

  const assignments = assignmentsData?.assignments ?? [];
  const diagnostics = diagnosticsData?.diagnostics ?? [];
  const activePatients = new Set(assignments.map((item) => item.patient.user.email)).size;
  const pendingAssignments = assignments.filter((item) => item.status === "PENDING").length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Counselor Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600">Track patients, assignments, and diagnostic records.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm font-medium text-zinc-600">Active Patients</p>
          <p className="mt-1 text-3xl font-semibold text-zinc-900">{activePatients}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-zinc-600">Pending Assignments</p>
          <p className="mt-1 text-3xl font-semibold text-zinc-900">{pendingAssignments}</p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-zinc-900">My Patients</h2>
          <div className="flex gap-2">
            <Button variant="secondary">
              <Plus className="mr-1 h-4 w-4" />
              Add Diagnostic
            </Button>
            <Button>
              <Plus className="mr-1 h-4 w-4" />
              Add Prescription
            </Button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                <th className="px-3">Patient</th>
                <th className="px-3">Email</th>
                <th className="px-3">Task</th>
                <th className="px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="rounded-lg bg-zinc-50 text-sm text-zinc-800">
                  <td className="rounded-l-lg px-3 py-3 font-medium">
                    {assignment.patient.user.firstName} {assignment.patient.user.lastName}
                  </td>
                  <td className="px-3 py-3">{assignment.patient.user.email}</td>
                  <td className="px-3 py-3">{assignment.task}</td>
                  <td className="rounded-r-lg px-3 py-3">
                    <AssignmentStatusBadge status={assignment.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-zinc-500">Total diagnostics logged: {diagnostics.length}</p>
      </Card>
    </div>
  );
}
