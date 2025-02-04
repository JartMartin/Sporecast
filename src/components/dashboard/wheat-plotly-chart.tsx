import { Loading3D } from "@/components/ui/loading-3d";

export function WheatPlotlyChart() {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loading3D size="sm" />
      </div>
    );
  }
  // ... rest of component
}