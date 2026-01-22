import { UserPlus, Search, FileCheck, Plane } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: UserPlus,
      step: "01",
      title: "Create Your Profile",
      description:
        "Workers register and build their profile with skills, experience, and documents. Agencies register and get verified.",
    },
    {
      icon: Search,
      step: "02",
      title: "Search & Connect",
      description:
        "Agencies search for qualified workers using filters. Workers browse verified job opportunities from trusted employers.",
    },
    {
      icon: FileCheck,
      step: "03",
      title: "Admin Verification",
      description:
        "Our admin team verifies worker availability and agency legitimacy. All selections are reviewed for compliance.",
    },
    {
      icon: Plane,
      step: "04",
      title: "Visa & Placement",
      description:
        "Approved agencies send job offers and visa documents. Workers receive confirmation and begin their journey abroad.",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple, transparent process to connect Ethiopian talent with global opportunities
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-border -translate-x-1/2 z-0" />
              )}
              
              <div className="relative z-10 bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="text-4xl font-bold text-muted/40">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
