import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Copy, Mail, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";
import type { EmergencyContact } from "@/types/emergency";
import { isMobile, isIOS } from "@/utils/platform";
import { formatPhoneForWhatsApp } from "@/utils/phoneFormatter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SOSButton = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [showFallbackDialog, setShowFallbackDialog] = useState(false);
  const [fallbackMessage, setFallbackMessage] = useState("");
  const [fallbackPhone, setFallbackPhone] = useState("");

  const playAlarmSound = () => {
    // Create an oscillating alarm sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800; // Hz
    oscillator.type = 'square';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    
    // Create alternating alarm pattern
    let isHigh = true;
    const interval = setInterval(() => {
      oscillator.frequency.value = isHigh ? 800 : 600;
      isHigh = !isHigh;
    }, 200);
    
    // Stop after 5 seconds
    setTimeout(() => {
      clearInterval(interval);
      oscillator.stop();
      audioContext.close();
    }, 5000);
  };

  const tryOpenWhatsApp = async (phone: string, message: string): Promise<boolean> => {
    const encodedMessage = encodeURIComponent(message);
    
    // Try multiple WhatsApp methods in order
    const urls = [
      `whatsapp://send?phone=${phone}&text=${encodedMessage}`,
      `https://wa.me/${phone}?text=${encodedMessage}`,
      `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`,
      `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`,
    ];
    
    for (const url of urls) {
      try {
        const opened = window.open(url, '_blank', 'noopener,noreferrer');
        if (opened && !opened.closed) {
          return true;
        }
      } catch (error) {
        console.error("Failed to open:", url, error);
      }
      // Small delay between attempts
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    
    return false;
  };

  const shareViaNativeAPI = async (message: string): Promise<boolean> => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: message,
          title: "🚨 EMERGENCY ALERT"
        });
        return true;
      } catch (error) {
        console.error("Native share error:", error);
      }
    }
    return false;
  };

  const shareViaSMS = (phone: string, message: string): boolean => {
    const encodedMessage = encodeURIComponent(message);
    const smsUrl = isIOS()
      ? `sms:${phone}&body=${encodedMessage}`
      : `sms:${phone}?body=${encodedMessage}`;
    
    try {
      window.location.href = smsUrl;
      return true;
    } catch (error) {
      console.error("SMS error:", error);
      return false;
    }
  };

  const copyToClipboard = async (message: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(message);
      return true;
    } catch (error) {
      console.error("Clipboard error:", error);
      return false;
    }
  };

  const shareOnWhatsApp = async (contact: EmergencyContact, location?: { lat: number; lng: number }, isFirst: boolean = false) => {
    let message = `🚨 EMERGENCY! I need help immediately!\n\n`;
    
    if (location) {
      message += `My current location:\nhttps://www.google.com/maps?q=${location.lat},${location.lng}\n\n`;
    } else {
      message += `I couldn't share my exact location, but I need help now!\n\n`;
    }
    
    message += `Please help me or contact authorities!\n\n- Sent from Rakshika Safety App`;
    
    const formattedPhone = formatPhoneForWhatsApp(contact.phone, contact.countryCode || "91");
    
    // Try WhatsApp first
    const whatsappOpened = await tryOpenWhatsApp(formattedPhone, message);
    
    if (whatsappOpened) {
      toast.success(`✅ WhatsApp opened for ${contact.name}`);
      return true;
    }
    
    // If first contact failed, show fallback dialog once
    if (isFirst) {
      // Try native share API
      if (await shareViaNativeAPI(message)) {
        toast.success("✅ Shared via system share");
        return true;
      }
      
      // Try SMS on mobile
      if (isMobile() && shareViaSMS(formattedPhone, message)) {
        toast.success("✅ Opened SMS app");
        return true;
      }
      
      // Last resort: show dialog with options
      if (await copyToClipboard(message)) {
        setFallbackMessage(message);
        setFallbackPhone(formattedPhone);
        setShowFallbackDialog(true);
        toast.info("📋 Message copied. Please share manually.");
        return true;
      }
    } else {
      // For subsequent contacts, just copy to clipboard
      await copyToClipboard(message);
      toast.info(`📋 Message for ${contact.name} copied`);
    }
    
    return false;
  };

  const handleSOS = () => {
    setIsActivated(true);
    
    // Play alarm sound
    playAlarmSound();
    
    // Vibrate pattern
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200, 100, 200]);
    }
    
    toast.error("🚨 SOS Alert Activated!", {
      description: "Sending emergency alerts to your contacts...",
      duration: 5000,
    });
    
    // Get emergency contacts from localStorage
    const stored = localStorage.getItem("emergencyContacts");
    const contacts: EmergencyContact[] = stored ? JSON.parse(stored) : [];
    
    if (contacts.length === 0) {
      toast.warning("⚠️ No emergency contacts added. Please add contacts in the Emergency Contacts section.");
      setTimeout(() => setIsActivated(false), 2000);
      return;
    }
    
    // Get location and share via WhatsApp
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          console.log("Emergency location:", location);
          toast.success("📍 Location obtained");
          
          // Send to contacts with delay between each
          for (let i = 0; i < contacts.length; i++) {
            await new Promise(resolve => setTimeout(resolve, i * 250));
            await shareOnWhatsApp(contacts[i], location, i === 0);
          }
          toast.success(`✅ Processed ${contacts.length} contact(s)`);
          
          setTimeout(() => setIsActivated(false), 5000);
        },
        async (error) => {
          console.error("Location error:", error);
          
          let errorMessage = "❌ Could not get location. ";
          if (error.code === 1) {
            errorMessage += "Location access denied.";
          } else if (error.code === 2) {
            errorMessage += "Location unavailable.";
          } else if (error.code === 3) {
            errorMessage += "Location request timed out.";
          }
          
          toast.error(errorMessage);
          toast.info("Sending alerts without location...");
          
          // Send alerts without location as fallback
          for (let i = 0; i < contacts.length; i++) {
            await new Promise(resolve => setTimeout(resolve, i * 250));
            await shareOnWhatsApp(contacts[i], undefined, i === 0);
          }
          toast.success(`✅ Processed ${contacts.length} contact(s)`);
          
          setTimeout(() => setIsActivated(false), 3000);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast.error("❌ Geolocation not supported");
      toast.info("Sending alerts without location...");
      
      // Send alerts without location as fallback
      (async () => {
        for (let i = 0; i < contacts.length; i++) {
          await new Promise(resolve => setTimeout(resolve, i * 250));
          await shareOnWhatsApp(contacts[i], undefined, i === 0);
        }
        toast.success(`✅ Processed ${contacts.length} contact(s)`);
      })();
      
      setTimeout(() => setIsActivated(false), 3000);
    }
  };

  return (
    <>
      <Button
        onClick={handleSOS}
        disabled={isActivated}
        size="lg"
        className={`sos-glow bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-2xl h-32 w-32 md:h-40 md:w-40 rounded-full shadow-2xl transition-all duration-300 ${
          isActivated ? 'animate-pulse' : 'hover:scale-105'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="h-12 w-12 md:h-16 md:w-16" />
          <span>{isActivated ? 'ALERTING...' : 'SOS'}</span>
        </div>
      </Button>

      <Dialog open={showFallbackDialog} onOpenChange={setShowFallbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>WhatsApp Blocked - Use Backup Options</DialogTitle>
            <DialogDescription>
              Your browser or network blocked WhatsApp. Use one of these backup methods:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg text-sm max-h-32 overflow-y-auto">
              {fallbackMessage}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  copyToClipboard(fallbackMessage);
                  toast.success("📋 Copied to clipboard");
                }}
                className="w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Message
              </Button>
              
              {isMobile() && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const encodedMessage = encodeURIComponent(fallbackMessage);
                    const smsUrl = isIOS()
                      ? `sms:${fallbackPhone}&body=${encodedMessage}`
                      : `sms:${fallbackPhone}?body=${encodedMessage}`;
                    window.location.href = smsUrl;
                    toast.success("📱 Opening SMS app");
                  }}
                  className="w-full"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send SMS
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={() => {
                  const subject = encodeURIComponent("🚨 EMERGENCY ALERT");
                  const body = encodeURIComponent(fallbackMessage);
                  window.location.href = `mailto:?subject=${subject}&body=${body}`;
                  toast.success("📧 Opening email app");
                }}
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              
              <Button
                variant="outline"
                onClick={async () => {
                  const opened = await tryOpenWhatsApp(fallbackPhone, fallbackMessage);
                  if (opened) {
                    toast.success("✅ WhatsApp opened");
                    setShowFallbackDialog(false);
                  } else {
                    toast.error("❌ Still blocked. Try other options.");
                  }
                }}
                className="w-full"
              >
                <Phone className="h-4 w-4 mr-2" />
                Try WhatsApp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SOSButton;
