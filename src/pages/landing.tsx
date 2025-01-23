import { useEffect, useState, useRef } from "react";
import { MainNav } from "@/components/navigation/main-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { MarketForecast } from "@/components/landing/market-forecast";
import { ChallengesSection } from "@/components/landing/challenges-section";
import { WhySporecast } from "@/components/landing/why-sporecast";
import { HowItWorks } from "@/components/landing/how-it-works";
import { VisionSection } from "@/components/landing/vision-section";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { SporaChat } from "@/components/dashboard/spora-chat";
import { cn } from "@/lib/utils";

export function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Update section visibility based on scroll position
      sectionsRef.current.forEach((section, index) => {
        if (!section) return;
        
        const rect = section.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.75;
        
        if (isInView) {
          section.classList.add('animate-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MainNav />

      {/* Hero Section */}
      <div className="relative flex-1 w-full overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div 
            className="absolute inset-0 bg-[linear-gradient(110deg,#10b981,#0d9488)]" 
            style={{ opacity: 0.05 }} 
          />
          <svg 
            className="absolute w-full h-full" 
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M0 32V0h32" fill="none" stroke="currentColor" strokeOpacity="0.05" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <HeroSection isVisible={isVisible} />
            <MarketForecast isVisible={isVisible} />
          </div>
        </div>
      </div>

      {/* Continuous Background Animation */}
      <div className="relative">
        <div 
          className="absolute inset-0 w-full"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(16, 185, 129, 0.05) 15%, rgba(13, 148, 136, 0.05) 35%, transparent 65%)',
            transform: `translateY(${scrollY * 0.2}px)`,
            transition: 'transform 0.1s ease-out',
            height: '300vh',
            pointerEvents: 'none',
          }}
        />

        {/* Content Sections */}
        <div 
          ref={el => sectionsRef.current[0] = el}
          className={cn(
            "relative opacity-0 translate-y-4",
            "transition-all duration-1000 ease-out",
            "animate-in:opacity-100 animate-in:translate-y-0"
          )}
        >
          <ChallengesSection />
        </div>

        <div 
          ref={el => sectionsRef.current[1] = el}
          className={cn(
            "relative opacity-0 translate-y-4",
            "transition-all duration-1000 ease-out delay-100",
            "animate-in:opacity-100 animate-in:translate-y-0"
          )}
        >
          <WhySporecast />
        </div>

        <div 
          ref={el => sectionsRef.current[2] = el}
          className={cn(
            "relative opacity-0 translate-y-4",
            "transition-all duration-1000 ease-out delay-200",
            "animate-in:opacity-100 animate-in:translate-y-0"
          )}
        >
          <HowItWorks scrollY={scrollY} />
        </div>

        <div 
          ref={el => sectionsRef.current[3] = el}
          className={cn(
            "relative opacity-0 translate-y-4",
            "transition-all duration-1000 ease-out delay-300",
            "animate-in:opacity-100 animate-in:translate-y-0"
          )}
        >
          <VisionSection />
        </div>

        <div 
          ref={el => sectionsRef.current[4] = el}
          className={cn(
            "relative opacity-0 translate-y-4",
            "transition-all duration-1000 ease-out delay-400",
            "animate-in:opacity-100 animate-in:translate-y-0"
          )}
        >
          <FinalCta />
        </div>
      </div>

      <Footer />

      {/* Add Spora Chat */}
      <SporaChat />
    </div>
  );
}