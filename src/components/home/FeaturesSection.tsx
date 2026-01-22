import { Shield, Clock, HeadphonesIcon, FileText, Globe2, Users } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Employers",
      description:
        "Every agency goes through a strict verification process to ensure safe and legal employment.",
    },
    {
      icon: FileText,
      title: "Document Management",
      description:
        "Secure storage and management of CVs, certificates, and visa documents all in one place.",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description:
        "Track your application status from selection to visa processing to final placement.",
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description:
        "Dedicated support team available around the clock to assist workers and agencies.",
    },
    {
      icon: Globe2,
      title: "Global Reach",
      description:
        "Access opportunities in 45+ countries across the Middle East, Europe, and beyond.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Join a community of workers sharing experiences and supporting each other abroad.",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Why Choose HireEthiopian?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide a trusted platform with features designed to make international recruitment safe and efficient
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
