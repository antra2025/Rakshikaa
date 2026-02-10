import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Users2, HandHeart } from "lucide-react";
import { toast } from "sonner";

const supportOptions = [
  {
    icon: MessageCircle,
    title: "Anonymous Chat",
    description: "Connect with trained counselors and support volunteers anonymously.",
    action: "Start Chat",
  },
  {
    icon: Users2,
    title: "Support Groups",
    description: "Join community support groups and connect with others who understand.",
    action: "Find Groups",
  },
  {
    icon: HandHeart,
    title: "Legal Assistance",
    description: "Get free legal advice and assistance for women's rights and safety issues.",
    action: "Get Help",
  },
  {
    icon: Heart,
    title: "Counseling Services",
    description: "Access professional counseling services for emotional and psychological support.",
    action: "Book Session",
  },
];

const CommunitySupport = () => {
  const handleAction = (title: string) => {
    toast.success(`Connecting to ${title}...`, {
      description: "Our support team will reach out to you shortly.",
    });
  };

  return (
    <section className="py-16 px-4 bg-background" id="community">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">
          Community Support
        </h2>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          You're not alone - Connect with our supportive community
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {supportOptions.map((option, index) => (
            <Card
              key={index}
              className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-primary/20"
            >
              <div className="flex flex-col gap-4">
                <div className="bg-gradient-primary p-4 rounded-full w-fit">
                  <option.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-2xl">{option.title}</h3>
                <p className="text-muted-foreground text-lg">{option.description}</p>
                <Button
                  onClick={() => handleAction(option.title)}
                  className="bg-gradient-primary hover:opacity-90 w-full md:w-auto"
                >
                  {option.action}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-secondary/50 border-2 border-primary/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">24/7 Support Hotline</h3>
            <p className="text-muted-foreground mb-6">
              If you need immediate support, our trained volunteers are available round the clock
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <a href="tel:1091" className="text-3xl font-bold text-primary hover:underline">
                📞 1091
              </a>
              <span className="hidden md:inline text-muted-foreground">|</span>
              <a href="mailto:support@rakshika.org" className="text-lg text-primary hover:underline">
                ✉️ support@rakshika.org
              </a>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CommunitySupport;
