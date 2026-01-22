import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-secondary-foreground sm:text-4xl lg:text-5xl">
            Ready to Start Your Journey?
          </h2>
          <p className="mt-6 text-lg text-secondary-foreground/80">
            Whether you're a skilled worker looking for opportunities abroad or an agency seeking qualified talent, we're here to help you succeed.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/register/worker">
                Register as Worker
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="xl"
              className="bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90"
            >
              <Link to="/register/agency">Register as Agency</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
