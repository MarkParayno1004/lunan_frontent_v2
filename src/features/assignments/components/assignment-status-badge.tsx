import { Badge } from "@/components/ui/badge";

type AssignmentStatusBadgeProps = {
  status: string | null | undefined;
};

export function AssignmentStatusBadge({ status }: AssignmentStatusBadgeProps) {
  if (status === "COMPLETED") {
    return <Badge variant="success">Completed</Badge>;
  }

  if (status === "PENDING") {
    return <Badge variant="warning">Pending</Badge>;
  }

  return <Badge variant="neutral">{status ?? "Unknown"}</Badge>;
}
