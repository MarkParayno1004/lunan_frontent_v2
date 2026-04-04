"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { Card } from "@/components/ui/card";
import { ASSIGNMENTS_QUERY } from "@/features/assignments/graphql";
import { DIAGNOSTICS_QUERY } from "@/features/diagnostics/graphql";
import { PRESCRIPTIONS_QUERY } from "@/features/prescriptions/graphql";
import { AssignmentStatusBadge } from "@/features/assignments/components/assignment-status-badge";
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";
import { useCurrentUserFirstName } from "@/features/auth/hooks/use-current-user-first-name";

type AssignmentItem = {
  id: string;
  task: string;
  status: string;
};

type DiagnosticItem = {
  id: string;
  description: string;
  createdAt: string | null;
  counselor: { user: { firstName: string; lastName: string } };
};

type PrescriptionItem = {
  id: string;
  prescribedMedicine: string;
  createdAt: string | null;
  counselor: { user: { firstName: string; lastName: string } };
};

type AssignmentsData = { assignments: AssignmentItem[] | null };
type DiagnosticsData = { diagnostics: DiagnosticItem[] | null };
type PrescriptionsData = { prescriptions: PrescriptionItem[] | null };

type TimelineItem = {
  id: string;
  label: string;
  createdAt: string | null;
  by: string;
};

export default function PatientDashboardPage() {
  const firstName = useCurrentUserFirstName();
  const { data: assignmentsData, loading: loadingAssignments } =
    useQuery<AssignmentsData>(ASSIGNMENTS_QUERY);
  const { data: diagnosticsData, loading: loadingDiagnostics } =
    useQuery<DiagnosticsData>(DIAGNOSTICS_QUERY);
  const { data: prescriptionsData, loading: loadingPrescriptions } =
    useQuery<PrescriptionsData>(PRESCRIPTIONS_QUERY);
  const assignments = assignmentsData?.assignments ?? [];
  const diagnostics = diagnosticsData?.diagnostics ?? [];
  const prescriptions = prescriptionsData?.prescriptions ?? [];

  const timelineItems = useMemo<TimelineItem[]>(() => {
    const diagnosisItems = diagnostics.map((item) => ({
      id: item.id,
      label: `Diagnostic: ${item.description}`,
      createdAt: item.createdAt,
      by: `${item.counselor.user.firstName} ${item.counselor.user.lastName}`,
    }));

    const prescriptionItems = prescriptions.map((item) => ({
      id: item.id,
      label: `Prescription: ${item.prescribedMedicine}`,
      createdAt: item.createdAt,
      by: `${item.counselor.user.firstName} ${item.counselor.user.lastName}`,
    }));

    return [...diagnosisItems, ...prescriptionItems].sort((a, b) =>
      (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
    );
  }, [diagnostics, prescriptions]);

  if (loadingAssignments || loadingDiagnostics || loadingPrescriptions) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          {firstName ? `Welcome back, ${firstName}!` : "Welcome back!"}
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Review your treatment plan and medical activity.
        </p>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-zinc-900">Treatment Plan</h2>
        <ul className="mt-3 space-y-2">
          {assignments.map((assignment) => (
            <li
              key={assignment.id}
              className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2"
            >
              <span className="text-sm text-zinc-800">{assignment.task}</span>
              <AssignmentStatusBadge status={assignment.status} />
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-zinc-900">
          Medical Records Timeline
        </h2>
        <div className="mt-4 space-y-3">
          {timelineItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-3"
            >
              <p className="text-sm font-medium text-zinc-900">{item.label}</p>
              <p className="mt-1 text-xs text-zinc-500">
                By {item.by}{" "}
                {item.createdAt
                  ? `on ${new Date(item.createdAt).toLocaleDateString()}`
                  : ""}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
