import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SOSButton from "@/components/SOSButton";
import EmergencyContacts from "@/components/EmergencyContacts";
import EmergencyContactsManager from "@/components/EmergencyContactsManager";
import SafetyTips from "@/components/SafetyTips";
import CommunitySupport from "@/components/CommunitySupport";
import ContactSection from "@/components/ContactSection";
import LocationSharing from "@/components/LocationSharing";
import { Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-hero overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="h-16 w-16 text-primary animate-scale-in" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="gradient-text">Rakshika</span>
            <span className="block text-3xl md:text-4xl mt-2 text-muted-foreground">रक्षिका</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 animate-fade-in">
            Your Guardian Angel for Women's Safety
          </p>
          
          <div className="flex justify-center mb-8 animate-scale-in">
            <SOSButton />
          </div>
          
          <p className="text-muted-foreground animate-fade-in">
            Press the SOS button in case of emergency
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </section>

      <EmergencyContacts />
      <EmergencyContactsManager />
      <LocationSharing />
      <SafetyTips />
      <CommunitySupport />
      <ContactSection />
      
      <Footer />
    </div>
  );
};

export default Index;
