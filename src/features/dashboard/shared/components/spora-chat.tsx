import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Send, Sprout, CreditCard, BarChart2, Settings, Plus, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const standardOptions = [
  {
    id: "metrics",
    label: "Questions about metrics",
    description: "Help with portfolio statistics and trends",
    icon: BarChart2
  },
  {
    id: "features",
    label: "Platform features",
    description: "Learn about tools and capabilities",
    icon: Settings
  },
  {
    id: "request",
    label: "Request commodity",
    description: "Suggest new commodities to add",
    icon: Plus
  },
  {
    id: "payments",
    label: "Billing & payments",
    description: "Help with invoices and subscriptions",
    icon: CreditCard
  },
  {
    id: "other",
    label: "Other questions",
    description: "Get help with anything else",
    icon: HelpCircle
  }
];

export function SporaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('spora-welcomed');
    setShowWelcome(!hasSeenWelcome && !hasInteracted);

    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        localStorage.setItem('spora-welcomed', 'true');
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [hasInteracted, showWelcome]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className={cn(
          "w-[300px] h-[450px] flex flex-col shadow-lg",
          "animate-in slide-in-from-bottom-5 duration-300",
          "bg-white/95 backdrop-blur-md rounded-2xl border-neutral-200/80",
          // Mobile responsive styles
          "max-w-[calc(100vw-3rem)] max-h-[calc(100vh-6rem)]"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-teal-500 to-emerald-500 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Sprout className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Spora Assistant</h3>
                <p className="text-[10px] text-white/80">AI-powered help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gradient-to-b from-neutral-50/50 to-white">
            {/* Welcome Message */}
            <div className="flex gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Sprout className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="bg-white rounded-xl p-2.5 max-w-[85%] shadow-sm border border-neutral-100">
                <p className="text-xs text-neutral-700 leading-relaxed">
                  Hi! I'm Spora, your AI assistant. How can I help you today?
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-1.5 pt-1">
              {standardOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.id}
                    variant="outline"
                    className="justify-start h-auto p-2.5 hover:bg-neutral-50 text-left rounded-xl border-neutral-200 group transition-all duration-200"
                    onClick={() => setMessage(option.label)}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="h-6 w-6 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:bg-teal-100">
                        <Icon className="h-3.5 w-3.5 text-teal-600" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-neutral-900">{option.label}</div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-neutral-100 bg-white/80 backdrop-blur-sm rounded-b-2xl">
            <form 
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (message.trim()) {
                  setMessage("");
                }
              }}
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 text-xs h-8 rounded-xl border-neutral-200"
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={!message.trim()}
                className="h-8 w-8 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </Card>
      ) : (
        <div className="relative">
          <TooltipProvider>
            <Tooltip open={showWelcome}>
              <TooltipTrigger asChild>
                <div
                  className="spora-button"
                  onClick={() => {
                    setIsOpen(true);
                    setHasInteracted(true);
                    setShowWelcome(false);
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    '--i': 'rgb(13, 148, 136)',
                    '--j': 'rgb(16, 185, 129)',
                  } as React.CSSProperties}
                >
                  <Sprout className={cn(
                    "icon",
                    isHovered && "opacity-0 -translate-x-2"
                  )} />
                  <span className={cn(
                    "title",
                    isHovered && "opacity-100 translate-x-0"
                  )}>
                    Meet Spora
                  </span>
                  <div className="notification-dot" />
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="left" 
                className="bg-white p-2.5 max-w-[180px] shadow-lg border border-neutral-100 rounded-xl"
              >
                <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-900">
                  <Sprout className="h-3.5 w-3.5 text-teal-500" />
                  Meet Spora
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">
                  Your AI assistant is here to help
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}

export default SporaChat;