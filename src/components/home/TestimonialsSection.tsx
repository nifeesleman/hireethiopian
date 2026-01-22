import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Tigist Alemayehu",
      role: "Nurse, Working in UAE",
      content:
        "HireEthiopian made my dream of working abroad a reality. The process was transparent and the support team helped me every step of the way.",
      rating: 5,
    },
    {
      name: "Ahmed Hassan",
      role: "Construction Worker, Saudi Arabia",
      content:
        "I was worried about finding legitimate agencies, but HireEthiopian verified everything. Now I have a stable job and can support my family.",
      rating: 5,
    },
    {
      name: "Gulf Recruitment Agency",
      role: "Verified Agency, Dubai",
      content:
        "Finding qualified Ethiopian workers has never been easier. The platform's verification system ensures we get reliable candidates.",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Success Stories
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from workers and agencies who found success through our platform
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 shadow-sm border border-border"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-chart-1 text-chart-1" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
