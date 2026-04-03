import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70",
        className,
      )}
      {...props}
    />
  );
}
