import { Shield, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <span className="text-xl font-bold gradient-text">Rakshika</span>
                <span className="text-sm text-muted-foreground block">रक्षिका</span>
              </div>
            </div>
            <p className="text-muted-foreground">
              Empowering women with safety tools and community support for a secure tomorrow.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#emergency" className="hover:text-primary transition-colors">Emergency Dial</a></li>
              <li><a href="#tips" className="hover:text-primary transition-colors">Safety Tips</a></li>
              <li><a href="#community" className="hover:text-primary transition-colors">Community</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Emergency Numbers</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Women Helpline: <a href="tel:1091" className="text-primary font-bold hover:underline">1091</a></li>
              <li>Police: <a href="tel:100" className="text-primary font-bold hover:underline">100</a></li>
              <li>Ambulance: <a href="tel:108" className="text-primary font-bold hover:underline">108</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            Made with <Heart className="h-4 w-4 text-primary fill-primary" /> for women's safety
          </p>
          <p className="mt-2 text-sm">
            © 2026 Rakshika. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
