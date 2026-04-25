import { Link } from "@tanstack/react-router";
import { Sparkles, Instagram, Youtube, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border/50 bg-gradient-to-b from-transparent to-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-2xl gradient-btn flex items-center justify-center text-primary-foreground shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-display text-xl font-bold">
                reel<span className="gradient-text">factory</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              A global reel-making agency crafting scroll-stopping short-form content for
              brands, creators and storytellers.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-card border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-card border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-card border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/services" className="hover:text-primary">Services</Link></li>
              <li><Link to="/reels" className="hover:text-primary">Our Reels</Link></li>
              <li><Link to="/team" className="hover:text-primary">Team</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold mb-3">Get in touch</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="mailto:hello@reelfactory.xyz" className="hover:text-primary">hello@reelfactory.xyz</a></li>
              <li><a href="tel:+10000000000" className="hover:text-primary">+1 (000) 000-0000</a></li>
              <li>Worldwide · Remote</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ReelFactory.xyz · All rights reserved.</p>
          <p>Made with ✨ for creators worldwide</p>
        </div>
      </div>
    </footer>
  );
}
