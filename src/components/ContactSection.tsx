import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully!", {
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="py-16 px-4 bg-secondary/30" id="contact">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">
          Contact Us
        </h2>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Have questions or need assistance? We're here to help
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8 border-2 border-primary/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border-primary/20"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-primary/20"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="border-primary/20"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
                Send Message
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-6 border-2 border-primary/20 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-primary p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Phone</h3>
                  <p className="text-muted-foreground">Emergency: 1091</p>
                  <p className="text-muted-foreground">Support: +91 78271 70170</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-primary/20 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-primary p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Email</h3>
                  <p className="text-muted-foreground">support@rakshika.org</p>
                  <p className="text-muted-foreground">help@rakshika.org</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-primary/20 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-primary p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Address</h3>
                  <p className="text-muted-foreground">National Commission for Women</p>
                  <p className="text-muted-foreground">New Delhi, India</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
