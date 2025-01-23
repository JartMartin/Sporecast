import { useState } from "react";
import { Link } from "react-router-dom";
import { MainNav } from "@/components/navigation/main-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Brain, Calendar, Settings, TrendingUp, Coffee, ArrowRight } from "lucide-react";
import { SporaChat } from "@/components/dashboard/spora-chat";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Brain,
    title: "Advanced ML Models",
    description: "Full access to daily refreshed machine learning models trained on 120,000 variables per commodity"
  },
  {
    icon: Calendar,
    title: "Daily Forecasts",
    description: "Real-time daily forecasts, always reflecting the latest market conditions"
  },
  {
    icon: Settings,
    title: "Custom Notifications",
    description: "Customizable notifications, tailored to your needs and preferences"
  },
  {
    icon: TrendingUp,
    title: "Full Transparency",
    description: "Access to supporting metrics, including expected volatility and model performance"
  }
];

const faqs = [
  {
    question: "What does all access include?",
    answer: "All access includes every feature available for your selected commodity: real-time forecasts, market analysis, custom alerts, historical data, API access, and priority support. There are no feature restrictions or hidden tiers."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period."
  },
  {
    question: "How does the free trial work?",
    answer: "Start with a 14-day free trial to experience the full platform. No credit card required, and you can cancel anytime during the trial period."
  },
  {
    question: "Can I add more commodities later?",
    answer: "Yes, you can add or remove commodities from your portfolio at any time through our Commodity Store after registration."
  }
];

export function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate pricing
  const monthlyPrice = 99;
  const annualPrice = monthlyPrice * 10; // 2 months free
  const price = isAnnual ? annualPrice : monthlyPrice;
  const savings = isAnnual ? monthlyPrice * 2 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MainNav />

      <main className="flex-1">
        <div className="relative py-12 md:py-24 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-emerald-50" />
            <svg
              className="absolute w-full h-full opacity-[0.15]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="pricing-grid"
                  width="32"
                  height="32"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M0 32V0h32" fill="none" stroke="currentColor" strokeOpacity="0.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pricing-grid)" />
            </svg>
          </div>

          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Simple, Transparent{" "}
                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Pricing
                </span>
              </h1>
              <p className="text-xl text-gray-600">
                €99 per commodity per month. All access, no hidden fees.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4">
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  !isAnnual ? "text-teal-900" : "text-gray-500"
                )}>
                  Monthly billing
                </span>
                <Switch
                  checked={isAnnual}
                  onCheckedChange={setIsAnnual}
                  className="data-[state=checked]:bg-teal-600"
                />
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  isAnnual ? "text-teal-900" : "text-gray-500"
                )}>
                  Annual billing
                  {isAnnual && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700">
                      2 months free
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="mt-16 max-w-2xl mx-auto">
              <Card className="p-8">
                <div className="space-y-8">
                  {/* Price Display */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-5xl font-bold">€{price}</span>
                      <span className="text-gray-500">
                        /{isAnnual ? 'year' : 'month'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">per commodity</div>
                    {savings > 0 && (
                      <div className="text-sm text-teal-600 font-medium mt-2">
                        Save €{savings} with annual billing
                      </div>
                    )}
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {features.map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <div key={feature.title} className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center">
                              <Icon className="h-5 w-5 text-teal-600" />
                            </div>
                            <h3 className="font-medium">{feature.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 pl-11">
                            {feature.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <Link to="/auth?tab=signup" className="block">
                    <Button className="w-full group" size="lg">
                      <span className="flex items-center gap-2">
                        Get Started Now
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </Link>

                  <p className="text-sm text-center text-muted-foreground">
                    14-day free trial • No credit card required
                  </p>
                </div>
              </Card>
            </div>

            {/* Key Details */}
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    All Access Per Commodity
                  </h3>
                  <p className="text-sm text-gray-600">
                    Access every feature, forecast, and alert tailored to your selected commodity with no restrictions.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    Build Your Portfolio
                  </h3>
                  <p className="text-sm text-gray-600">
                    After signing up, browse the Commodity Store to select and purchase the procurement assets that matter most to your business.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    No Hidden Fees
                  </h3>
                  <p className="text-sm text-gray-600">
                    Simple, upfront pricing with no surprises or extra charges.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="mt-16 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Additional CTA Section */}
            <div className="mt-16 max-w-2xl mx-auto text-center space-y-8">
              <h2 className="text-2xl font-bold">Still have questions or concerns?</h2>
              <p className="text-gray-600">
                Chat with Spora for any questions about our platform, payments, or methodology. Prefer a personal discussion? Schedule an online coffee with our team!
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-center">
                <Link to="/schedule">
                  <Button 
                    variant="outline"
                    size="lg"
                    className={cn(
                      "gap-2 border-2 border-teal-600/20 hover:border-teal-600/40 bg-white hover:bg-teal-50/50 transition-all duration-300",
                      "group relative overflow-hidden"
                    )}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <Coffee className={cn(
                      "h-4 w-4 transition-all duration-500",
                      isHovered ? "rotate-12 scale-110" : ""
                    )} />
                    Schedule an online coffee
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Spora Chat */}
      <SporaChat />
    </div>
  );
}

export default PricingPage;