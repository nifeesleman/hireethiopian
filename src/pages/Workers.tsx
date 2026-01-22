import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Briefcase, Globe2, Star, Filter, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const Workers = () => {
  const workers = [
    {
      id: 1,
      name: "Tigist A.",
      title: "Registered Nurse",
      location: "Addis Ababa",
      experience: "5 years",
      languages: ["English", "Amharic", "Arabic"],
      skills: ["ICU", "Emergency Care", "Patient Care"],
      availability: "Available",
      rating: 4.9,
      verified: true,
    },
    {
      id: 2,
      name: "Yohannes M.",
      title: "Construction Supervisor",
      location: "Bahir Dar",
      experience: "8 years",
      languages: ["English", "Amharic"],
      skills: ["Site Management", "Safety Protocols", "Team Leadership"],
      availability: "Available",
      rating: 4.8,
      verified: true,
    },
    {
      id: 3,
      name: "Sara H.",
      title: "Hotel Manager",
      location: "Hawassa",
      experience: "6 years",
      languages: ["English", "Amharic", "French"],
      skills: ["Hospitality", "Guest Relations", "Operations"],
      availability: "Available",
      rating: 4.7,
      verified: true,
    },
    {
      id: 4,
      name: "Dawit K.",
      title: "Professional Driver",
      location: "Dire Dawa",
      experience: "10 years",
      languages: ["English", "Amharic", "Arabic"],
      skills: ["Heavy Vehicles", "Navigation", "Maintenance"],
      availability: "Available",
      rating: 4.9,
      verified: true,
    },
    {
      id: 5,
      name: "Hana B.",
      title: "Caregiver",
      location: "Addis Ababa",
      experience: "4 years",
      languages: ["English", "Amharic"],
      skills: ["Elderly Care", "Childcare", "First Aid"],
      availability: "Available",
      rating: 4.6,
      verified: true,
    },
    {
      id: 6,
      name: "Abebe T.",
      title: "Executive Chef",
      location: "Addis Ababa",
      experience: "12 years",
      languages: ["English", "Amharic", "Italian"],
      skills: ["International Cuisine", "Kitchen Management", "Menu Planning"],
      availability: "2 weeks notice",
      rating: 5.0,
      verified: true,
    },
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-br from-background via-background to-accent py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Find Skilled Workers
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse verified Ethiopian professionals ready for international employment
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border mb-8">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workers by name, skill, or location..."
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Select>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Skill Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="hospitality">Hospitality</SelectItem>
                    <SelectItem value="domestic">Domestic</SelectItem>
                    <SelectItem value="driving">Driving</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Experience</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5+">5+ years</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Language</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="arabic">Arabic</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">6</span> workers
            </p>
            <Select defaultValue="rating">
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="experience">Most Experience</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Worker Listings */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                    {worker.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{worker.name}</h3>
                      {worker.verified && (
                        <CheckCircle2 className="h-4 w-4 text-chart-1" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{worker.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-chart-1 text-chart-1" />
                      <span className="text-xs font-medium text-foreground">
                        {worker.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {worker.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    {worker.experience} experience
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe2 className="h-4 w-4" />
                    {worker.languages.join(", ")}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {worker.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Badge
                    variant={worker.availability === "Available" ? "default" : "outline"}
                    className="text-xs"
                  >
                    {worker.availability}
                  </Badge>
                  <Button asChild size="sm">
                    <Link to="/register/agency">View Profile</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg">
              Load More Workers
            </Button>
          </div>

          {/* CTA for Agencies */}
          <div className="mt-12 bg-secondary rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-secondary-foreground mb-4">
              Ready to Hire?
            </h2>
            <p className="text-secondary-foreground/80 mb-6 max-w-2xl mx-auto">
              Register your agency to access full worker profiles, contact information, and start the verification process.
            </p>
            <Button asChild variant="hero" size="lg">
              <Link to="/register/agency">Register as Agency</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Workers;
