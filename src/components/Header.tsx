import { Button } from "@/components/ui/button";
import { Shield, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const handleAuthClick = () => {
    window.location.href = user ? "/dashboard" : "/auth";
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <Shield className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold gradient-text">Rakshika</span>
              <span className="text-xs text-muted-foreground">रक्षिका</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Button variant="ghost" onClick={() => scrollToSection("emergency")}>
              Emergency
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection("tips")}>
              Safety Tips
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection("community")}>
              Community
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection("contact")}>
              Contact
            </Button>
            <Button onClick={handleAuthClick} size="sm">
              <User className="h-4 w-4 mr-2" />
              {user ? "Dashboard" : "Sign In"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-primary" />
            ) : (
              <Menu className="h-6 w-6 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border animate-fade-in">
            <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection("emergency")}>
              Emergency
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection("tips")}>
              Safety Tips
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection("community")}>
              Community
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection("contact")}>
              Contact
            </Button>
            <Button className="w-full justify-start" onClick={handleAuthClick}>
              <User className="h-4 w-4 mr-2" />
              {user ? "Dashboard" : "Sign In"}
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
