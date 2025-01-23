import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const quotes = [
  {
    text: "I skate to where the puck is going to be, not where it has been.",
    author: "Wayne Gretzky"
  },
  {
    text: "You can't connect the dots looking forward; you can only connect them looking backwards.",
    author: "Steve Jobs"
  },
  {
    text: "In football, it's simple: you're on time or you're too late. If you're too late, you have to make sure you leave on time.",
    author: "Johan Cruijff"
  }
];

export function QuoteCarousel() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
        setIsTransitioning(false);
      }, 500); // Half of the transition duration
    }, 10000); // Changed from 5000 to 10000 for 10-second intervals

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      <blockquote 
        className={cn(
          "text-2xl font-medium text-white transition-all duration-500",
          isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        )}
      >
        "{quotes[currentQuote].text}"
      </blockquote>
      <cite 
        className={cn(
          "block text-white/80 transition-all duration-500",
          isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        )}
      >
        {quotes[currentQuote].author}
      </cite>
    </div>
  );
}