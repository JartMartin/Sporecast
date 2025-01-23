import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Sprout, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote: "By providing real-time data insights, our platform helps businesses navigate the complexities of the food commodity market, making it easier to make informed decisions and improve market efficiency.",
    author: "Prof. dr. Laurens Sloot",
    role: "Co-owner / Advisory board",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
  },
  {
    quote: "Machine learning provides practical solutions to real-world challenges. By using these techniques, we help Agri businesses make smarter decisions and support procurement.",
    author: "Jelte Bottema",
    role: "Co-Owner / PhD candidate in Physics",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
  }
];

export function VisionSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full overflow-hidden py-24 sm:py-32"
      onMouseMove={handleMouseMove}
    >
      {/* Interactive Background */}
      <div className="absolute inset-0">
        {/* Gradient following mouse */}
        <div 
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(20, 184, 166, 0.08) 0%, rgba(16, 185, 129, 0.04) 30%, transparent 70%)`,
            opacity: isVisible ? 1 : 0,
          }}
        />

        {/* Decorative patterns */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={cn(
          "max-w-3xl mx-auto text-center space-y-8 transition-all duration-1000",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50/50 px-4 py-1.5">
            <span className="text-sm font-medium text-teal-900">
              Our Vision
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Shaping a{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Smarter, Fairer
              </span>
            </span>
            {" "}Agri-Market for Tomorrow
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We envision a future where food and retail leaders gain clear, data-driven insights to make smarter decisions. Free from middlemen influence, our platform analyzes decades of market trends, revealing patterns that drive commodity prices and empowering businesses to navigate complexities with confidence.
          </p>

          <div className="pt-4">
            <Link to="/story">
              <Button 
                variant="outline" 
                size="lg"
                className="group border-2 border-teal-600/20 hover:border-teal-600/40 bg-white hover:bg-teal-50/50"
              >
                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent group-hover:text-teal-700 flex items-center gap-2">
                  Discover the Vision Behind Sporecast
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Side-by-Side Testimonials */}
        <div className={cn(
          "mt-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-1000 delay-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Logo */}
              <div className={cn(
                "absolute -top-6 left-1/2 -translate-x-1/2 z-10",
                "transition-transform duration-300",
                hoveredCard === index && "scale-110"
              )}>
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full p-3 shadow-lg">
                  <Sprout className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className={cn(
                "relative bg-white rounded-2xl p-8 shadow-xl h-full",
                "transition-all duration-300 group",
                hoveredCard === index && "transform scale-[1.02]"
              )}>
                {/* Background Pattern */}
                <div className={cn(
                  "absolute inset-0 rounded-2xl transition-opacity duration-300",
                  "bg-[radial-gradient(#10b98120_1px,transparent_1px)] [background-size:16px_16px]",
                  hoveredCard === index ? "opacity-100" : "opacity-0"
                )} />

                {/* Content */}
                <div className="pt-6 text-center space-y-6 relative">
                  <blockquote className="text-lg text-gray-700 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center justify-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className={cn(
                        "h-12 w-12 rounded-full object-cover ring-2 ring-offset-2",
                        "transition-all duration-300",
                        hoveredCard === index ? "ring-teal-500" : "ring-gray-200"
                      )}
                    />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className={cn(
                  "absolute inset-0 rounded-2xl transition-opacity duration-300",
                  "bg-gradient-to-br from-teal-50/50 to-emerald-50/50",
                  hoveredCard === index ? "opacity-100" : "opacity-0"
                )} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}