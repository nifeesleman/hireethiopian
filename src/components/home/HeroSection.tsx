import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  const highlights = [
    "Verified Employers",
    "Legal Placements",
    "Visa Support",
    "24/7 Assistance",
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              🌍 Trusted by 500+ agencies worldwide
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Connecting Ethiopian Talent with{" "}
              <span className="text-primary">Global Opportunity</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              Join thousands of skilled Ethiopian workers finding verified overseas employment opportunities. 
              Legal, transparent, and trusted recruitment platform.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild variant="hero" size="xl">
                <Link to="/register/worker">
                  Find Jobs Abroad
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <Link to="/register/agency">Hire Workers</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-chart-1" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={heroImage}
                alt="Ethiopian professionals ready for global opportunities"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
            </div>
            
            {/* Stats Card */}
            <div className="absolute -bottom-6 -left-6 rounded-xl bg-card p-6 shadow-xl border border-border">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium text-primary"
                    >
                      {i * 5}K+
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">15,000+</p>
                  <p className="text-sm text-muted-foreground">Workers Placed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
