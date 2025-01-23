import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainNav } from "@/components/navigation/main-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Coffee, CalendarDays, Building2, User2, Clock, ArrowRight, Languages } from "lucide-react";
import { cn } from "@/lib/utils";

// Only allow Tuesdays and Fridays
const isDateAvailable = (date: Date) => {
  const day = date.getDay();
  return day === 2 || day === 5; // 2 is Tuesday, 5 is Friday
};

// Available time slots
const timeSlots = [
  "10:00", "11:00", "14:00", "15:00", "16:00"
];

// Language options
const languages = [
  { value: "en", label: "English" },
  { value: "nl", label: "Dutch" }
];

export function SchedulePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    date: null as Date | null,
    timeSlot: "",
    language: "en" // Default to English
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically:
      // 1. Send the data to your backend
      // 2. Generate a meeting link (e.g., Google Meet)
      // 3. Send confirmation email
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Meeting Scheduled Successfully!",
        description: "Check your email for the meeting details and calendar invite.",
      });

      navigate('/', { replace: true });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule the meeting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MainNav />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-2 mb-6">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 opacity-25 blur" />
                <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <Coffee className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Let's Connect Over Coffee
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Schedule a friendly 15-minute chat to learn about Sporecast. We'll explain our platform, showcase our features, and discuss how we can help optimize your procurement strategy.
            </p>
          </div>

          <Card className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <div className="relative">
                      <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="company"
                        placeholder="Enter your company name"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language" className="flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      Preferred Language *
                    </Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your preferred language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language.value} value={language.value}>
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Meeting Time Selection */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Select Date *
                    </Label>
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
                      disabled={(date) => !isDateAvailable(date) || date < new Date()}
                      className="rounded-lg border shadow-sm"
                      classNames={{
                        day_selected: "bg-teal-600 text-white hover:bg-teal-600 hover:text-white focus:bg-teal-600 focus:text-white",
                        day_today: "bg-gray-100 text-gray-900",
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Select Time *
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot}
                          type="button"
                          variant={formData.timeSlot === slot ? "default" : "outline"}
                          className={cn(
                            "justify-start gap-2 h-12",
                            formData.timeSlot === slot && "bg-teal-600 hover:bg-teal-700"
                          )}
                          onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot }))}
                        >
                          <Clock className="h-4 w-4" />
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                  <p className="font-medium mb-1">Availability Note:</p>
                  <p>
                    Online coffee meetings are available on Tuesdays and Fridays. On other days, we're focused on optimizing our models and adding more food commodities to ensure you have the best tools for decision-making.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading || !formData.date || !formData.timeSlot}
              >
                {loading ? (
                  "Scheduling..."
                ) : (
                  <span className="flex items-center gap-2">
                    Schedule Meeting
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default SchedulePage;