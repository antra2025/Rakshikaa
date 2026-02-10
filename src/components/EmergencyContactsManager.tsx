import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Trash2, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import type { EmergencyContact } from "@/types/emergency";
import { validatePhone, formatPhoneDisplay } from "@/utils/phoneFormatter";

const EmergencyContactsManager = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [countryCode, setCountryCode] = useState("91");

  useEffect(() => {
    const stored = localStorage.getItem("emergencyContacts");
    if (stored) {
      setContacts(JSON.parse(stored));
    }
  }, []);

  const saveContacts = (updatedContacts: EmergencyContact[]) => {
    localStorage.setItem("emergencyContacts", JSON.stringify(updatedContacts));
    setContacts(updatedContacts);
  };

  const addContact = () => {
    if (!newName.trim() || !newPhone.trim()) {
      toast.error("Please enter both name and phone number");
      return;
    }

    if (!validatePhone(newPhone)) {
      toast.error("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: newName.trim(),
      phone: newPhone.trim(),
      countryCode: countryCode,
    };

    const updatedContacts = [...contacts, newContact];
    saveContacts(updatedContacts);
    setNewName("");
    setNewPhone("");
    toast.success(`${newName} added to emergency contacts`);
  };

  const deleteContact = (id: string) => {
    const updatedContacts = contacts.filter((c) => c.id !== id);
    saveContacts(updatedContacts);
    toast.info("Contact removed");
  };

  const testLocation = () => {
    toast.info("Testing location access...");
    
    if (!navigator.geolocation) {
      toast.error("❌ Geolocation not supported by your browser");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        };
        toast.success(`✅ Location access working!\nLat: ${location.lat}, Lng: ${location.lng}`, {
          duration: 5000,
        });
      },
      (error) => {
        let errorMessage = "❌ Location test failed: ";
        if (error.code === 1) {
          errorMessage += "Permission denied. Please enable location access in your browser settings.";
        } else if (error.code === 2) {
          errorMessage += "Location unavailable. Check your device settings.";
        } else if (error.code === 3) {
          errorMessage += "Request timed out. Please try again.";
        }
        toast.error(errorMessage, { duration: 5000 });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <section className="py-16 px-4 bg-muted/30" id="contacts-manager">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">
          My Emergency Contacts
        </h2>
        <p className="text-center text-muted-foreground mb-8 text-lg">
          Add trusted contacts who will receive your SOS alerts
        </p>
        
        <div className="flex justify-center mb-8">
          <Button variant="outline" onClick={testLocation} className="gap-2">
            <MapPin className="h-4 w-4" />
            Test Location Access
          </Button>
        </div>

        <Card className="p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Add New Contact</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., Mom, Sister, Friend"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addContact()}
              />
            </div>
            <div>
              <Label htmlFor="countryCode">Country Code</Label>
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country code" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="91">+91 (India)</SelectItem>
                  <SelectItem value="1">+1 (USA/Canada)</SelectItem>
                  <SelectItem value="44">+44 (UK)</SelectItem>
                  <SelectItem value="971">+971 (UAE)</SelectItem>
                  <SelectItem value="61">+61 (Australia)</SelectItem>
                  <SelectItem value="65">+65 (Singapore)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number (without country code)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., 9876543210"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ""))}
                onKeyPress={(e) => e.key === "Enter" && addContact()}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter 10-digit mobile number
              </p>
            </div>
            <Button onClick={addContact} className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </Card>

        <div className="grid gap-4">
          {contacts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No emergency contacts added yet. Add contacts who will receive your SOS alerts via WhatsApp.
              </p>
            </Card>
          ) : (
            contacts.map((contact) => (
              <Card key={contact.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold">{contact.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        +{contact.countryCode || "91"} {formatPhoneDisplay(contact.phone)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteContact(contact.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default EmergencyContactsManager;
