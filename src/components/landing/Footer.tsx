'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-4 border-t border-white/20 bg-white/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="flex-shrink-0">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Match My Sponsor
            </h3>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <a
              href="/terms"
              className="text-gray-600 hover:text-[#667eea] transition-colors duration-200"
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="text-gray-600 hover:text-[#667eea] transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="/contact"
              className="text-gray-600 hover:text-[#667eea] transition-colors duration-200"
            >
              Contact
            </a>
          </div>

          {/* Copyright */}
          <div className="text-gray-600 text-sm">
            © {currentYear} Match My Sponsor. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
