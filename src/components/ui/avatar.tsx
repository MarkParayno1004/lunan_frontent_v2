import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  status?: "Online" | "Away";
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

export function Avatar({ src, alt, status, size = "md", className, ...props }: AvatarProps) {
  return (
    <div className={cn("relative inline-block", className)} {...props}>
      <div className={cn("overflow-hidden rounded-full bg-zinc-100", sizeClasses[size])}>
        {src ? (
          <img src={src} alt={alt || "Avatar"} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-zinc-500">
            {alt ? alt.charAt(0).toUpperCase() : "U"}
          </div>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white ring-0",
            status === "Online" ? "bg-emerald-500" : "bg-amber-400"
          )}
        />
      )}
    </div>
  );
}
