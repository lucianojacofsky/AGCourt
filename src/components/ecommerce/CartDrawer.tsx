"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '../ui/Button';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neo-dark/70 backdrop-blur-sm"
          />

          {/* Drawer Box */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed inset-y-0 right-0 max-w-full flex pl-10"
          >
            <div className="w-screen max-w-md bg-neo-bg border-l-4 border-neo-dark flex flex-col">
              {/* Header */}
              <div className="p-6 border-b-4 border-neo-dark flex items-center justify-between bg-neo-lime">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-neo-dark" />
                  <span className="font-display text-xl font-black uppercase tracking-wider text-neo-dark">
                    Tu Carrito ({cartCount})
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 border-2 border-neo-dark bg-white hover:bg-neo-orange hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 no-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 border-3 border-neo-dark flex items-center justify-center bg-white shadow-neo mb-4">
                      <ShoppingBag className="w-8 h-8 text-neo-dark/40" />
                    </div>
                    <p className="font-display text-lg font-black uppercase tracking-wider text-neo-dark">
                      El carrito está vacío
                    </p>
                    <p className="text-xs text-neo-dark/60 mt-1">
                      ¡Sal a la cancha y agrega algunas zapatillas!
                    </p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {cartItems.map(({ product, quantity }) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="border-3 border-neo-dark bg-white p-4 flex gap-4 shadow-neo relative"
                      >
                        {/* Image */}
                        <div className="w-20 h-20 border-2 border-neo-dark bg-amber-50 flex-shrink-0 overflow-hidden">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-display text-sm font-black uppercase tracking-wide text-neo-dark truncate max-w-[180px]">
                              {product.name}
                            </h4>
                            <span className="text-xs font-bold text-neo-orange">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="w-7 h-7 border-2 border-neo-dark bg-white hover:bg-neo-lime flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-display font-black text-sm text-neo-dark w-6 text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="w-7 h-7 border-2 border-neo-dark bg-white hover:bg-neo-lime flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="absolute top-2 right-2 p-1 text-neo-dark/50 hover:text-neo-orange hover:border-neo-orange border-2 border-transparent hover:bg-neo-orange/10 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )
              }
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t-4 border-neo-dark bg-white flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="font-display text-base font-black uppercase tracking-wider text-neo-dark">
                      Total
                    </span>
                    <span className="font-display text-xl font-black text-neo-orange">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>

                  <Link href="/checkout" onClick={onClose} className="w-full">
                    <Button variant="secondary" className="w-full">
                      Ir al Checkout
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
