import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Clock, Share2, StopCircle, Users } from "lucide-react";
import { toast } from "sonner";

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
}

const LocationSharing = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [duration, setDuration] = useState(30);
  const [remainingTime, setRemainingTime] = useState(0);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [trustedContacts, setTrustedContacts] = useState<string>("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSharing && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            stopSharing();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSharing, remainingTime]);

  const startSharing = () => {
    if (!trustedContacts.trim()) {
      toast.error("Please enter trusted contact emails or phone numbers");
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now(),
        };
        setLocation(locationData);
        
        if (!isSharing) {
          setIsSharing(true);
          setRemainingTime(duration * 60);
          toast.success("📍 Location sharing started!", {
            description: `Sharing with: ${trustedContacts.split(',').length} contact(s) for ${duration} minutes`,
          });
        }
      },
      (error) => {
        console.error("Location error:", error);
        toast.error("Unable to access location. Please enable location services.");
        stopSharing();
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    setWatchId(id);
  };

  const stopSharing = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsSharing(false);
    setRemainingTime(0);
    toast.info("Location sharing stopped");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const shareLocation = () => {
    if (location) {
      const mapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      const shareText = `🚨 Emergency Location Alert from Rakshika\n\nI'm sharing my live location with you.\n\nCurrent Location: ${mapsUrl}\n\nThis link was generated at ${new Date(location.timestamp).toLocaleString()}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Rakshika - Live Location',
          text: shareText,
        }).then(() => {
          toast.success("Location shared successfully!");
        }).catch((error) => {
          console.error('Error sharing:', error);
          copyToClipboard(shareText);
        });
      } else {
        copyToClipboard(shareText);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Location link copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy location");
    });
  };

  return (
    <section id="location" className="py-16 px-4 bg-card/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-4">Real-Time Location Sharing</h2>
          <p className="text-muted-foreground text-lg">
            Share your live location with trusted contacts during emergencies
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Location Sharing Settings
            </CardTitle>
            <CardDescription>
              Configure your trusted contacts and sharing duration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="contacts" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Trusted Contacts (comma-separated emails or phone numbers)
              </Label>
              <Input
                id="contacts"
                type="text"
                placeholder="contact1@email.com, +1234567890, contact2@email.com"
                value={trustedContacts}
                onChange={(e) => setTrustedContacts(e.target.value)}
                disabled={isSharing}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Sharing Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                min="5"
                max="240"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                disabled={isSharing}
                className="bg-background border-border"
              />
            </div>

            {location && isSharing && (
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <span className="text-sm text-primary font-semibold flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                        Live Sharing
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Time Remaining:</span>
                      <span className="text-sm font-mono text-accent-foreground">
                        {formatTime(remainingTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Coordinates:</span>
                      <span className="text-sm font-mono">
                        {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3 flex-wrap">
              {!isSharing ? (
                <Button
                  onClick={startSharing}
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Start Sharing Location
                </Button>
              ) : (
                <>
                  <Button
                    onClick={stopSharing}
                    size="lg"
                    variant="destructive"
                    className="flex-1"
                  >
                    <StopCircle className="mr-2 h-5 w-5" />
                    Stop Sharing
                  </Button>
                  <Button
                    onClick={shareLocation}
                    size="lg"
                    variant="secondary"
                    className="flex-1"
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Share Link
                  </Button>
                </>
              )}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                <strong>How it works:</strong> When you start sharing, your location will be tracked in real-time for the specified duration. 
                You can share the link with your trusted contacts who can view your current location on a map. 
                The sharing automatically stops after the time expires or you can manually stop it anytime.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default LocationSharing;