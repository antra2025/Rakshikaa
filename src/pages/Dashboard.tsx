import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, LogOut, UserPlus, Trash2, Phone, AlertCircle, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { validatePhone, formatPhoneDisplay } from "@/utils/phoneFormatter";

interface Contact {
  id: string;
  name: string;
  phone: string;
  country_code: string;
}

interface SOSAlert {
  id: string;
  latitude: number | null;
  longitude: number | null;
  contacts_notified: number;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [countryCode, setCountryCode] = useState("91");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchContacts();
      fetchAlerts();
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user!.id)
      .single();
    if (data?.display_name) setDisplayName(data.display_name);
  };

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setContacts(data);
  };

  const fetchAlerts = async () => {
    const { data, error } = await supabase
      .from("sos_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    if (!error && data) setAlerts(data);
  };

  const addContact = async () => {
    if (!newName.trim() || !newPhone.trim()) {
      toast.error("Please enter both name and phone number");
      return;
    }
    if (!validatePhone(newPhone)) {
      toast.error("Please enter a valid phone number (at least 10 digits)");
      return;
    }
    const { error } = await supabase.from("contacts").insert({
      user_id: user!.id,
      name: newName.trim(),
      phone: newPhone.trim(),
      country_code: countryCode,
    });
    if (error) {
      toast.error("Failed to add contact");
    } else {
      toast.success(`${newName} added!`);
      setNewName("");
      setNewPhone("");
      fetchContacts();
    }
  };

  const deleteContact = async (id: string) => {
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (!error) {
      toast.info("Contact removed");
      fetchContacts();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Shield className="h-12 w-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Rakshika</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {displayName || user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, <span className="gradient-text">{displayName || "User"}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Manage your safety settings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="bg-primary/20 p-3 rounded-full">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{contacts.length}</p>
                <p className="text-sm text-muted-foreground">Emergency Contacts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="bg-destructive/20 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{alerts.length}</p>
                <p className="text-sm text-muted-foreground">SOS Alerts Sent</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="bg-accent/20 p-3 rounded-full">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">Active</p>
                <p className="text-sm text-muted-foreground">Safety Status</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contacts */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    placeholder="e.g., Mom, Sister"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Country Code</Label>
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    placeholder="9876543210"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <Button onClick={addContact} className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {contacts.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">No contacts yet</p>
                </Card>
              ) : (
                contacts.map((contact) => (
                  <Card key={contact.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <Phone className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">
                            +{contact.country_code} {formatPhoneDisplay(contact.phone)}
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

          {/* SOS History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent SOS Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No SOS alerts yet. Stay safe! 🛡️
                  </p>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="bg-destructive/20 p-2 rounded-full">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {alert.contacts_notified} contact(s) notified
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(alert.created_at).toLocaleString()}
                          </p>
                        </div>
                        {alert.latitude && (
                          <a
                            href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <MapPin className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
