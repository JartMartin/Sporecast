import { MainNav } from "@/components/navigation/main-nav";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Target, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/landing/footer";
import { SporaChat } from "@/features/dashboard/shared/components/spora-chat";

const timeline = [
  {
    year: "2020",
    title: "The Beginning",
    description: "Founded with a vision to revolutionize agricultural commodity trading through AI."
  },
  {
    year: "2021",
    title: "First AI Model",
    description: "Launched our first AI-powered price prediction model for wheat markets."
  },
  {
    year: "2022",
    title: "Global Expansion",
    description: "Expanded to cover multiple commodities across different global markets."
  },
  {
    year: "2023",
    title: "Advanced Analytics",
    description: "Introduced advanced analytics and real-time market insights."
  },
  {
    year: "2024",
    title: "Next Generation",
    description: "Launching next-generation AI models with unprecedented accuracy."
  }
];

const values = [
  {
    icon: Target,
    title: "Accuracy First",
    description: "We prioritize prediction accuracy above all else, ensuring our clients can make informed decisions."
  },
  {
    icon: Users,
    title: "Client Success",
    description: "Our clients' success is our success. We're committed to providing the best possible service."
  },
  {
    icon: LineChart,
    title: "Innovation",
    description: "Continuously pushing the boundaries of what's possible in market prediction technology."
  }
];

export function StoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MainNav />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative py-12 md:py-24 bg-gray-50">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Our Journey to{" "}
                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Transform Markets
                </span>
              </h1>
              <p className="text-xl text-gray-600">
                From a simple idea to a revolutionary platform, discover how we're changing the future of commodity trading.
              </p>
              <Link to="/auth?tab=signup">
                <Button 
                  size="lg"
                  className="group bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                >
                  <span className="flex items-center gap-2">
                    Join Our Journey
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-12 md:py-24">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Our Values</h2>
              <p className="mt-4 text-lg text-gray-600">The principles that guide everything we do</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="text-center space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="py-12 md:py-24 bg-gray-50">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Our Journey</h2>
              <p className="mt-4 text-lg text-gray-600">The milestones that shaped our success</p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-teal-500 to-emerald-500" />
              
              <div className="space-y-12">
                {timeline.map((event, index) => (
                  <div key={index} className={cn(
                    "relative flex items-center gap-8",
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  )}>
                    {/* Content */}
                    <div className="flex-1">
                      <div className={cn(
                        "bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg",
                        index % 2 === 0 ? "mr-4" : "ml-4"
                      )}>
                        <span className="text-sm font-bold text-teal-600">{event.year}</span>
                        <h3 className="text-lg font-semibold mt-1">{event.title}</h3>
                        <p className="text-gray-600 mt-2">{event.description}</p>
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500" />

                    {/* Empty Space */}
                    <div className="flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Add Spora Chat */}
      <SporaChat />
    </div>
  );
}

export default StoryPage;