import React from 'react';
import { Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] py-10 mt-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          
          {/* Copyright text */}
          <div>
            <span>© 2026 Evento Kerala Inc. All rights reserved.</span>
          </div>

          {/* Links and social icons */}
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Terms
            </a>
            <a href="#help" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Help
            </a>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors p-1"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors p-1"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
