import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <Card className={"bg-black border-0 text-white  w-full flex p-4"}>
      <CardHeader className="p-0">
        <div className="flex items-start gap-x-2 ">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-col ">
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-hidden flex-1 p-0 flex flex-col gap-y-4 ">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}
