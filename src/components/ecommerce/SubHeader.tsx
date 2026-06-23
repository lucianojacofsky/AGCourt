"use client";

import React from 'react';
import Link from 'next/link';

export const SubHeader = () => {
  return (
    <div className="bg-neutral-950 text-white border-b border-neutral-800 relative z-30 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
        
        {/* Left Section: Section Title */}
        <Link 
          href="/" 
          className="font-sans text-sm font-bold tracking-tight hover:text-neutral-300 transition-colors cursor-pointer"
        >
          COURT Basketball
        </Link>
        
        {/* Right Section: Sub navigation links */}
        <nav className="flex items-center gap-6">
          <Link 
            href="/?category=zapatillas" 
            className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Calzado
          </Link>
          <Link 
            href="/?category=ropa" 
            className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Ropa
          </Link>
          <Link 
            href="/?category=equipamiento" 
            className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Equipamiento
          </Link>
          <Link 
            href="/?category=ofertas" 
            className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Ofertas
          </Link>
        </nav>

      </div>
    </div>
  );
};
