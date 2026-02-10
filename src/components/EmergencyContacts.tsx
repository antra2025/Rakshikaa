import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Shield, Hospital, Building2 } from "lucide-react";

const emergencyNumbers = [
  { name: "Women Helpline", number: "1091", icon: Shield, color: "bg-primary" },
  { name: "Police Emergency", number: "112", icon: Shield, color: "bg-accent" },
  { name: "Ambulance", number: "108", icon: Hospital, color: "bg-destructive" },
  { name: "National Commission for Women", number: "7827170170", icon: Building2, color: "bg-primary" },
];

const EmergencyContacts = () => {
  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <section className="py-16 px-4 bg-background" id="emergency">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">
          Quick Emergency Dial
        </h2>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Tap to call instantly - Your safety is just a click away
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {emergencyNumbers.map((contact) => (
            <Card
              key={contact.number}
              className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-primary/20"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className={`${contact.color} p-4 rounded-full`}>
                  <contact.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg">{contact.name}</h3>
                <p className="text-3xl font-bold text-primary">{contact.number}</p>
                <Button
                  onClick={() => handleCall(contact.number)}
                  className="w-full bg-gradient-primary hover:opacity-90"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmergencyContacts;
