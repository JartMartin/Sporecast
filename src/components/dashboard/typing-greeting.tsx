import { useEffect, useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper function to format role text
function formatRole(role: string): string {
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function TypingGreeting() {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const { profile, loading } = useProfile();
  
  useEffect(() => {
    if (loading || !profile?.full_name) return;

    setIsVisible(true);

    const nameParts = profile.full_name.split(' ');
    const firstName = nameParts[0];
    const fullText = `Hey, ${firstName}!`;
    
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setShowCursor(false);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [profile, loading]);

  if (loading || !profile?.full_name) return null;

  const roleText = profile.role ? formatRole(profile.role) : '';
  const companyText = profile.company || '';
  const subText = roleText && companyText ? `${roleText} at ${companyText}` : '';

  return (
    <div className={cn(
      "flex items-center gap-4 transition-all duration-500",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      {/* Avatar */}
      <div className="relative group">
        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110">
          <User className="h-5 w-5 text-white" />
        </div>
        <div className="absolute -inset-1 bg-gradient-to-br from-teal-400/20 to-emerald-500/20 rounded-full opacity-0 blur group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Text Content */}
      <div className="space-y-0.5">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          {displayText}
          {showCursor && (
            <span className="ml-0.5 animate-pulse text-teal-500">|</span>
          )}
        </h1>
        {subText && (
          <p className={cn(
            "text-sm text-neutral-500 transition-all duration-500 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}>
            {subText}
          </p>
        )}
      </div>
    </div>
  );
}