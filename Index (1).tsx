import { useState, useCallback, useRef } from "react";
import Header from "@/components/Header";
import SOSButton from "@/components/SOSButton";
import QuickActions from "@/components/QuickActions";
import LocationMap from "@/components/LocationMap";
import EmergencyContacts from "@/components/EmergencyContacts";
import SafeStatus from "@/components/SafeStatus";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useEmergencyContacts } from "@/hooks/useEmergencyContacts";
import { useToast } from "@/hooks/use-toast";
import { Shield, Heart } from "lucide-react";

const Index = () => {
  const { location, loading, error, refresh } = useGeolocation();
  const { contacts, addContact, removeContact } = useEmergencyContacts();
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();
  const tapCount = useRef(0);
  const tapTimer = useRef<NodeJS.Timeout | null>(null);

  const triggerEmergency = useCallback(() => {
    // Call police
    window.location.href = "tel:112";
    
    // Start location sharing
    setIsSharing(true);

    // Share location with contacts (in a real app, this would send SMS/notifications)
    if (location && contacts.length > 0) {
      const message = `I am in danger. Please help me. My location: https://www.google.com/maps?q=${location.lat},${location.lng}`;
      console.log("Emergency message to contacts:", message);
      // In production, this would trigger backend SMS API
    }
  }, [location, contacts]);

  const handleSOSTap = useCallback(() => {
    tapCount.current += 1;
    
    if (tapCount.current === 3) {
      triggerEmergency();
      toast({
        title: "🚨 Emergency Alert Triggered",
        description: "Calling 112 and sharing your location.",
        variant: "destructive",
      });
      tapCount.current = 0;
      if (tapTimer.current) clearTimeout(tapTimer.current);
      return;
    }

    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 1500);
  }, [triggerEmergency, toast]);

  const handleCallPolice = () => {
    toast({
      title: "Calling Emergency Services",
      description: "Connecting you to 112...",
    });
  };

  const handleShareLocation = () => {
    setIsSharing(true);
    toast({
      title: "Location Sharing Started",
      description: "Your emergency contacts can now see your location.",
    });
  };

  const handleMarkSafe = () => {
    setIsSharing(false);
    toast({
      title: "Glad you're safe!",
      description: "Location sharing has been stopped.",
    });
  };

  return (
    <div className="min-h-screen bg-background" id="home">
      <Header />
      
      <main className="container pt-24 pb-32 space-y-8">
        {/* Hero Section with SOS */}
        <section className="py-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-safe/10 text-safe text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Your safety is our priority
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Stay <span className="text-gradient-sos">Safe</span>, Stay{" "}
            <span className="text-gradient-safe">Protected</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-10">
            Instant emergency help at your fingertips. Press the SOS button when you need immediate assistance.
          </p>

          <div onClick={handleSOSTap} className="cursor-pointer">
            <SOSButton onTrigger={triggerEmergency} />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Quick Actions</h2>
          <QuickActions
            onCallPolice={handleCallPolice}
            onShareLocation={handleShareLocation}
            location={location}
          />
        </section>

        {/* Location Map */}
        <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <LocationMap
            location={location}
            loading={loading}
            error={error}
            onRefresh={refresh}
          />
        </section>

        {/* Emergency Contacts */}
        <section className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <EmergencyContacts
            contacts={contacts}
            onAddContact={addContact}
            onRemoveContact={removeContact}
          />
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border mt-12">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span className="text-sm">Made with</span>
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm">for women's safety</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            SafeHer © 2024 • Emergency: 112
          </p>
        </footer>
      </main>

      {/* Safe Status Bar */}
      <SafeStatus isSharing={isSharing} onMarkSafe={handleMarkSafe} />
    </div>
  );
};

export default Index;
