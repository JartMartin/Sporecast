import { Button } from "@/components/ui/button";

interface UnsubscribeButtonProps {
  onClick: () => void;
}

export function UnsubscribeButton({ onClick }: UnsubscribeButtonProps) {
  return (
    <div className="flex justify-center mt-6">
      <Button
        variant="ghost"
        className="text-sm text-muted-foreground hover:text-destructive"
        onClick={onClick}
      >
        Want to unsubscribe from this commodity?
      </Button>
    </div>
  );
}