import { Loading3D } from "@/components/ui/loading-3d";

// Replace loading states with Loading3D
export function CommodityPage() {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loading3D />
      </div>
    );
  }
  // ... rest of component
}