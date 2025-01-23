import { Card } from "@/components/ui/card";

interface Activity {
  title: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-teal-500" />
            <div>
              <p className="font-medium">{activity.title}</p>
              <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}