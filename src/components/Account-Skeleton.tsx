import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function AccountSkeleton() {
  return (
    <Card className="w-full px-6 py-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="mt-4 h-4 w-20" />

      <Skeleton className="mt-12 h-6 w-40" />
      <Skeleton className="mt-2 h-4 w-40" />

      <Skeleton className="mt-10 h-6 w-40" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-2 h-4 w-3/4" />

      <Skeleton className="mt-10 h-6 w-36" />
      <Skeleton className="mt-2 h-4 w-1/2" />
      <Skeleton className="mt-2 h-4 w-3/4" />
    </Card>
  );
}
