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
import { Search, MapPin, Briefcase, DollarSign, Clock, Filter } from "lucide-react";
import { Link } from "react-router-dom";

const Jobs = () => {
  const jobs = [
    {
      id: 1,
      title: "Registered Nurse",
      company: "Dubai Healthcare City",
      location: "Dubai, UAE",
      salary: "$2,500 - $3,500/month",
      type: "Full-time",
      posted: "2 days ago",
      skills: ["Nursing", "English", "BLS Certified"],
      urgent: true,
    },
    {
      id: 2,
      title: "Construction Worker",
      company: "Al Futtaim Construction",
      location: "Riyadh, Saudi Arabia",
      salary: "$1,200 - $1,800/month",
      type: "Full-time",
      posted: "5 days ago",
      skills: ["Construction", "Physical Fitness", "Basic English"],
      urgent: false,
    },
    {
      id: 3,
      title: "Hotel Housekeeper",
      company: "Marriott International",
      location: "Doha, Qatar",
      salary: "$800 - $1,200/month",
      type: "Full-time",
      posted: "1 week ago",
      skills: ["Hospitality", "Cleaning", "Customer Service"],
      urgent: false,
    },
    {
      id: 4,
      title: "Private Driver",
      company: "Royal Family Office",
      location: "Kuwait City, Kuwait",
      salary: "$1,500 - $2,000/month",
      type: "Full-time",
      posted: "3 days ago",
      skills: ["Driving License", "Navigation", "Arabic Basic"],
      urgent: true,
    },
    {
      id: 5,
      title: "Caregiver / Nanny",
      company: "Premium Families Agency",
      location: "Manama, Bahrain",
      salary: "$600 - $1,000/month",
      type: "Full-time",
      posted: "1 week ago",
      skills: ["Childcare", "Cooking", "First Aid"],
      urgent: false,
    },
    {
      id: 6,
      title: "Restaurant Chef",
      company: "Hilton Hotels",
      location: "Muscat, Oman",
      salary: "$1,800 - $2,500/month",
      type: "Full-time",
      posted: "4 days ago",
      skills: ["Culinary Arts", "Kitchen Management", "HACCP"],
      urgent: false,
    },
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-br from-background via-background to-accent py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Find Jobs Abroad
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse verified job opportunities from trusted agencies worldwide
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border mb-8">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs, skills, or companies..."
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Select>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="uae">UAE</SelectItem>
                    <SelectItem value="saudi">Saudi Arabia</SelectItem>
                    <SelectItem value="qatar">Qatar</SelectItem>
                    <SelectItem value="kuwait">Kuwait</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="hospitality">Hospitality</SelectItem>
                    <SelectItem value="domestic">Domestic</SelectItem>
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
              Showing <span className="font-medium text-foreground">6</span> jobs
            </p>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="salary-high">Highest Salary</SelectItem>
                <SelectItem value="salary-low">Lowest Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Listings */}
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {job.title}
                      </h3>
                      {job.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{job.company}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.posted}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline">View Details</Button>
                    <Button asChild>
                      <Link to="/register/worker">Apply Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg">
              Load More Jobs
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Jobs;
