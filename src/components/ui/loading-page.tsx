import { Sprout } from "lucide-react";

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="loader">
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="logo">
          <Sprout />
        </div>
      </div>
    </div>
  );
}