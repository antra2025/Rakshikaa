import { Card } from "@/components/ui/card";
import { Lightbulb, Users, MapPin, Smartphone, Eye, Home } from "lucide-react";

const tips = [
  {
    icon: Lightbulb,
    title: "Trust Your Instincts",
    description: "If something feels wrong, it probably is. Don't ignore your gut feelings about people or situations.",
  },
  {
    icon: Users,
    title: "Stay in Groups",
    description: "There's safety in numbers. Travel with friends or in well-populated areas, especially at night.",
  },
  {
    icon: MapPin,
    title: "Share Your Location",
    description: "Let trusted contacts know where you are. Use location sharing features on your phone.",
  },
  {
    icon: Smartphone,
    title: "Keep Phone Charged",
    description: "Always keep your phone charged and have emergency numbers saved on speed dial.",
  },
  {
    icon: Eye,
    title: "Stay Aware",
    description: "Be aware of your surroundings. Avoid distractions like headphones in unfamiliar areas.",
  },
  {
    icon: Home,
    title: "Plan Your Route",
    description: "Know your route before traveling. Use well-lit, populated paths and avoid shortcuts through isolated areas.",
  },
];

const SafetyTips = () => {
  return (
    <section className="py-16 px-4 bg-secondary/30" id="tips">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">
          Daily Safety Tips
        </h2>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Essential advice to help you stay safe every day
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card border-2 border-primary/10 hover:border-primary/30"
            >
              <div className="flex flex-col gap-4">
                <div className="bg-gradient-primary p-3 rounded-lg w-fit">
                  <tip.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-xl">{tip.title}</h3>
                <p className="text-muted-foreground">{tip.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SafetyTips;
