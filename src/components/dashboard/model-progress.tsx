import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ModelProgress {
  name: string;
  progress: number;
}

interface ModelProgressCardProps {
  models: ModelProgress[];
}

export function ModelProgressCard({ models }: ModelProgressCardProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Model Training Progress</h3>
      <div className="space-y-4">
        {models.map((model, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2 text-sm">
              <span>{model.name}</span>
              <span>{model.progress}%</span>
            </div>
            <Progress value={model.progress} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  );
}