import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface UserProfile {
  name: string;
  specialization?: string; // For counselors
  patientId?: string; // For patients
  status: "Online" | "Away";
  avatarUrl?: string;
  bio: string;
  concern?: string; // Primary health concern/tag for patients
}

interface UserProfileCardProps {
  user: UserProfile;
  variant: "counselor" | "patient";
  className?: string;
}

export function UserProfileCard({ user, variant, className }: UserProfileCardProps) {
  const isCounselor = variant === "counselor";

  return (
    <Card
      className={cn(
        "group transition-transform duration-300 ease-in-out hover:-translate-y-1",
        className
      )}
    >
      <div className="flex flex-row gap-4">
        {/* Left Side: Avatar */}
        <Avatar
          src={user.avatarUrl}
          alt={user.name}
          status={user.status}
          size="lg"
          className="shrink-0"
        />

        {/* Right Side: Content */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900">{user.name}</h3>
              <Badge variant={user.status === "Online" ? "success" : "warning"}>
                {user.status}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-500">
                {isCounselor ? user.specialization : `ID: ${user.patientId}`}
              </span>
              {isCounselor && user.specialization && (
                <Badge variant="neutral" className="bg-zinc-100">
                  {user.specialization}
                </Badge>
              )}
              {!isCounselor && user.concern && (
                <Badge variant="warning" className="bg-amber-50">
                  {user.concern}
                </Badge>
              )}
            </div>

            <p className="mt-2 line-clamp-2 text-sm text-zinc-600 leading-relaxed">
              {user.bio}
            </p>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant={isCounselor ? "primary" : "secondary"}
              className={cn(
                "w-full sm:w-auto transition-colors",
                isCounselor 
                  ? "group-hover:bg-zinc-800" 
                  : "group-hover:bg-zinc-50"
              )}
            >
              {isCounselor ? "Book Appointment" : "View History"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
