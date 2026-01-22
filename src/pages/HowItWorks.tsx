import Layout from "@/components/layout/Layout";
import { UserPlus, Search, FileCheck, Plane, ShieldCheck, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  const workerSteps = [
    {
      icon: UserPlus,
      title: "Create Your Profile",
      description:
        "Sign up and build your professional profile. Add your skills, work experience, languages spoken, and upload your CV and relevant documents.",
    },
    {
      icon: Search,
      title: "Browse Opportunities",
      description:
        "Explore verified job listings from trusted agencies worldwide. Filter by country, industry, salary, and more to find your perfect match.",
    },
    {
      icon: FileCheck,
      title: "Apply & Get Selected",
      description:
        "Apply to jobs that interest you. When an agency selects you, our admin team verifies your availability and ensures everything is legitimate.",
    },
    {
      icon: Plane,
      title: "Receive Visa & Travel",
      description:
        "Once approved, the agency sends your visa documents and job offer. Prepare for your journey and start your new career abroad!",
    },
  ];

  const agencySteps = [
    {
      icon: ShieldCheck,
      title: "Register & Verify",
      description:
        "Create your agency account and submit verification documents. Our team reviews your credentials to ensure you're a legitimate employer.",
    },
    {
      icon: Search,
      title: "Search Workers",
      description:
        "Browse our database of skilled Ethiopian workers. Use filters to find candidates matching your requirements for skills, experience, and availability.",
    },
    {
      icon: FileCheck,
      title: "Select & Confirm",
      description:
        "Select workers you want to hire. Our admin team confirms worker availability and verifies the placement before you proceed.",
    },
    {
      icon: Clock,
      title: "Process & Deploy",
      description:
        "Upload visa documents and job offers. Track the entire process from selection to deployment on our platform.",
    },
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-br from-background via-background to-accent py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
              How It Works
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Our platform simplifies international recruitment with a transparent, verified process for both workers and agencies.
            </p>
          </div>

          {/* For Workers */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-1 w-12 bg-primary rounded-full" />
              <h2 className="text-2xl font-bold text-foreground">For Workers</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {workerSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative bg-card rounded-2xl p-6 shadow-sm border border-border"
                >
                  <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button asChild variant="hero" size="lg">
                <Link to="/register/worker">Start Your Journey</Link>
              </Button>
            </div>
          </div>

          {/* For Agencies */}
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="h-1 w-12 bg-secondary rounded-full" />
              <h2 className="text-2xl font-bold text-foreground">For Agencies</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {agencySteps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative bg-card rounded-2xl p-6 shadow-sm border border-border"
                >
                  <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                    <step.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link to="/register/agency">Register Your Agency</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorks;
