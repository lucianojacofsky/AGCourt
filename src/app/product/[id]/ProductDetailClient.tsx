"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/core/types';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Props {
  product: Product;
}

export default function ProductDetailClient({ product }: Props) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('10');
  const [showToast, setShowToast] = useState(false);
  const sizes = ['8', '9', '10', '11', '12'];

  const handleAddToCart = () => {
    addToCart(product, 1);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-6 relative">
      
      {/* Back Link */}
      <Link
        href="/"
        className="self-start flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al Catálogo
      </Link>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Image with Entry Animation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border border-neutral-200 rounded-2xl bg-neutral-50 p-6 shadow-xs overflow-hidden"
        >
          <div className="aspect-square rounded-xl bg-white overflow-hidden flex items-center justify-center border border-neutral-100">
            <motion.img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </motion.div>

        {/* Right Column: Content */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col gap-8"
        >
          {/* Name & Pricing */}
          <div>
            <Badge variant="dark" className="bg-neutral-900 text-white rounded-full border-none py-1 px-3 mb-4 text-[10px] lowercase first-letter:uppercase">
              {product.category}
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-neutral-900 leading-none mb-3">
              {product.name}
            </h1>
            <span className="font-display text-2xl font-bold text-neutral-900 block mt-2">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Description Section */}
          <div className="border-t border-neutral-200 pt-6">
            <h3 className="font-display text-xs font-extrabold uppercase tracking-widest text-neutral-400 mb-2">
              Descripción del Producto
            </h3>
            <p className="text-sm text-neutral-600 font-medium leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Size Selector */}
          {!isOutOfStock && (
            <div className="border-t border-neutral-200 pt-6">
              <span className="font-display text-xs font-extrabold uppercase tracking-wider text-neutral-950 block mb-3">
                Seleccionar Talle (US)
              </span>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border rounded-lg font-display text-sm font-bold flex items-center justify-center transition-colors cursor-pointer ${
                      selectedSize === size
                        ? 'bg-neutral-900 border-neutral-900 text-white'
                        : 'bg-white border-neutral-200 text-neutral-900 hover:border-neutral-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Inventory & CTA */}
          <div className="flex flex-col gap-4 border-t border-neutral-200 pt-6">
            <div className="text-xs font-bold text-neutral-500">
              {isOutOfStock ? (
                <span className="text-red-600 font-black uppercase">Sin stock temporalmente</span>
              ) : (
                <span>Unidades disponibles: <span className="font-black text-neutral-900">{product.stock}</span></span>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              variant="dark"
              size="lg"
              disabled={isOutOfStock}
              className="w-full flex items-center justify-center gap-3 rounded-full py-4 border-none shadow-none hover:bg-neutral-800 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Agregar al Carrito</span>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Pop Add-to-cart Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 border border-neutral-800 bg-neutral-950 text-white px-6 py-4 flex items-center gap-3 shadow-xl rounded-xl"
          >
            <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm uppercase tracking-wide">
                Agregado al Carrito
              </span>
              <span className="text-[10px] font-semibold text-neutral-400 uppercase">
                {product.name} (Talle US {selectedSize})
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
