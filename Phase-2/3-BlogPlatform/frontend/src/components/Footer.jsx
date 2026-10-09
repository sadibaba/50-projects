import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="relative z-10 bg-secondary/40 backdrop-blur-sm border-t border-secondary/30 mt-0">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <h3 className="font-display text-2xl text-text-primary mb-3">Chronica</h3>
          <p className="text-text-secondary text-sm font-serif leading-relaxed">
            Stories of remarkable people, preserved with reverence.
          </p>
        </div>

        {/* Platform */}
        <div>
          <h4 className="text-text-primary font-medium text-sm uppercase tracking-wider mb-4">
            Platform
          </h4>
          <ul className="space-y-2">
            <li><Link to="/home" className="text-text-secondary hover:text-accent text-sm transition-colors">Home</Link></li>
            <li><Link to="/posts" className="text-text-secondary hover:text-accent text-sm transition-colors">Stories</Link></li>
            <li><Link to="/details" className="text-text-secondary hover:text-accent text-sm transition-colors">Details</Link></li>
            <li><Link to="/about" className="text-text-secondary hover:text-accent text-sm transition-colors">About</Link></li>
            <li><Link to="/contact" className="text-text-secondary hover:text-accent text-sm transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-text-primary font-medium text-sm uppercase tracking-wider mb-4">
            Legal
          </h4>
          <ul className="space-y-2">
            <li><Link to="/terms" className="text-text-secondary hover:text-accent text-sm transition-colors">Terms</Link></li>
            <li><Link to="/privacy" className="text-text-secondary hover:text-accent text-sm transition-colors">Privacy</Link></li>
            <li><Link to="/cookies" className="text-text-secondary hover:text-accent text-sm transition-colors">Cookies</Link></li>
            <li><Link to="/disclaimer" className="text-text-secondary hover:text-accent text-sm transition-colors">Disclaimer</Link></li>
          </ul>
        </div>

        {/* More Legal */}
        <div>
          <h4 className="text-text-primary font-medium text-sm uppercase tracking-wider mb-4">
            Policies
          </h4>
          <ul className="space-y-2">
            <li><Link to="/acceptable-use" className="text-text-secondary hover:text-accent text-sm transition-colors">Acceptable Use</Link></li>
            <li><Link to="/dmca" className="text-text-secondary hover:text-accent text-sm transition-colors">DMCA</Link></li>
            <li><Link to="/refund" className="text-text-secondary hover:text-accent text-sm transition-colors">Refund</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 border-t border-secondary/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-text-secondary text-xs">
          © {new Date().getFullYear()} Chronica. All rights reserved.
        </p>
        <p className="text-text-secondary text-xs">
          Built with care. Made for readers.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;