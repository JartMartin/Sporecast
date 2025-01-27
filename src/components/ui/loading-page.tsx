import { Loader2 } from "lucide-react";

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
    </div>
  );
}