import { Users, Building2, Globe2, Award } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "15,000+",
      label: "Workers Registered",
      description: "Skilled professionals ready to work",
    },
    {
      icon: Building2,
      value: "500+",
      label: "Verified Agencies",
      description: "Trusted employers worldwide",
    },
    {
      icon: Globe2,
      value: "45+",
      label: "Countries",
      description: "Global placement destinations",
    },
    {
      icon: Award,
      value: "98%",
      label: "Success Rate",
      description: "Successful job placements",
    },
  ];

  return (
    <section className="bg-card py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className="h-7 w-7 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground lg:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 font-medium text-foreground">{stat.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
