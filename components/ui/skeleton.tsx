import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <>
      <div
        className={cn("animate-pulse rounded-md bg-slate-600/15 my-1", className)}
        {...props}
      />
      <div
        className={cn("animate-pulse rounded-md bg-slate-600/15 my-1", className)}
        {...props}
      />
    </>
  )
}

export { Skeleton }
