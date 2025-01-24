import { Loading3D } from "./loading-3d";

export function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
      <Loading3D />
      <p className="text-sm text-muted-foreground animate-pulse">
        Loading...
      </p>
    </div>
  );
}