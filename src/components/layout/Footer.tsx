import { Link } from "react-router-dom";
import { Globe, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Globe className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">
                Hire<span className="text-primary">Ethiopian</span>
              </span>
            </Link>
            <p className="text-sm text-secondary-foreground/80">
              Connecting Ethiopian talent with global opportunity. Legal, transparent, and verified employment.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* For Workers */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              For Workers
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/register/worker" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* For Agencies */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              For Agencies
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/register/agency" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  Register Agency
                </Link>
              </li>
              <li>
                <Link to="/workers" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  Find Workers
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/verification" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  Verification Process
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                Addis Ababa, Ethiopia
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                <Phone className="h-4 w-4 flex-shrink-0" />
                +251 911 123 456
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                <Mail className="h-4 w-4 flex-shrink-0" />
                info@hireethiopian.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-secondary-foreground/60">
              © {currentYear} HireEthiopian. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
