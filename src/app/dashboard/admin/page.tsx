import { Card } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600">System-wide view for platform management.</p>
      </div>
      <Card>
        <p className="text-sm text-zinc-700">
          Admin analytics and management tools can be plugged in here after backend admin queries are finalized.
        </p>
      </Card>
    </div>
  );
}
