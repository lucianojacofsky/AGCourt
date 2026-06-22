"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, LogIn, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Badge } from '../ui/Badge';
import { LoginModal } from './LoginModal';
import { CartDrawer } from './CartDrawer';
import { AnimatePresence } from 'framer-motion';

export const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <span className="font-display font-black text-2xl uppercase tracking-widest text-neutral-900 group-hover:text-orange-600 transition-colors">
              COURT
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link 
              href="/" 
              className="font-display text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-neutral-500 transition-colors cursor-pointer"
            >
              Catálogo
            </Link>

            {user && user.role !== 'ADMIN' && (
              <Link 
                href="/orders" 
                className="font-display text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-neutral-500 transition-colors cursor-pointer"
              >
                Mis Pedidos
              </Link>
            )}

            {user?.role === 'ADMIN' && (
              <Link 
                href="/admin" 
                className="font-display text-xs font-bold uppercase tracking-wider text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                Panel Admin
              </Link>
            )}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* User Session */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-neutral-900 uppercase truncate max-w-[120px]">
                    {user.name}
                  </span>
                  {user.role === 'ADMIN' && (
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                      Administrador
                    </span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="p-2.5 border border-neutral-200 rounded-full bg-white hover:bg-neutral-50 text-neutral-900 cursor-pointer transition-colors shadow-xs"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-neutral-900 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Ingresar
              </button>
            )}

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 border border-neutral-200 rounded-full bg-white hover:bg-neutral-50 text-neutral-900 cursor-pointer transition-colors shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 scale-90">
                  <Badge variant="orange" className="bg-orange-600 border-none text-white px-1.5 py-0.5 rounded-full text-[8px] font-bold">
                    {cartCount}
                  </Badge>
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer and Modal with AnimatePresence */}
      <AnimatePresence>
        {isLoginOpen && (
          <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
