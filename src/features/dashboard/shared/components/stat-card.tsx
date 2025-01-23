import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
}

export function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card className="p-5 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-neutral-500">{description}</p>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-teal-50 p-2.5 transition-colors duration-200">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}