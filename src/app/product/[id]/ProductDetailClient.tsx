"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Check, Ruler, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/core/types';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductCard } from '@/components/ecommerce/ProductCard';

interface Props {
  product: Product;
  relatedProducts?: Product[];
}

export default function ProductDetailClient({ product, relatedProducts = [] }: Props) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('10');
  const [showToast, setShowToast] = useState(false);
  const [activeView, setActiveView] = useState<number>(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const sizes = ['8', '9', '10', '11', '12'];

  // Dynamically calculate stock per size based on overall product stock
  const getSizeStock = (size: string): number => {
    if (product.stock <= 0) return 0;
    
    // Deterministic distribution of stock
    switch (size) {
      case '8': return Math.max(0, product.id.charCodeAt(0) % 3);
      case '9': return Math.max(1, product.id.charCodeAt(1) % 4);
      case '10': return Math.max(1, Math.min(product.stock, 5));
      case '11': return Math.max(0, product.stock - 3);
      case '12': return Math.max(0, product.id.charCodeAt(2) % 2);
      default: return 1;
    }
  };

  const selectedSizeStock = getSizeStock(selectedSize);

  const handleAddToCart = () => {
    if (selectedSizeStock <= 0) return;
    addToCart(product, 1);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const isOutOfStock = product.stock <= 0;

  // Gallery view configurations (Simulating different angles with CSS Transforms)
  const viewStyles = [
    { name: "Perfil", class: "scale-100 rotate-0" },
    { name: "Detalle Zoom", class: "scale-160 translate-x-8 -translate-y-4" },
    { name: "Ángulo Suela", class: "scale-125 -rotate-45 translate-y-6" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10 relative">
      
      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSizeGuideOpen(false)}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 text-neutral-950"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <h3 className="font-display text-lg font-bold uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-neutral-900" /> Guía de Talles
                </h3>
                <button 
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="text-xs font-bold uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

              {/* Equivalence Table */}
              <div className="overflow-hidden border border-neutral-200 rounded-xl bg-neutral-50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-100">
                      <th className="p-3 text-[10px] font-bold uppercase text-neutral-500 tracking-wider">US</th>
                      <th className="p-3 text-[10px] font-bold uppercase text-neutral-500 tracking-wider">AR (Equiv.)</th>
                      <th className="p-3 text-[10px] font-bold uppercase text-neutral-500 tracking-wider">Medida (CM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { us: "8", ar: "40.5", cm: "26.0" },
                      { us: "9", ar: "42", cm: "27.0" },
                      { us: "10", ar: "43", cm: "28.0" },
                      { us: "11", ar: "44", cm: "29.0" },
                      { us: "12", ar: "45.5", cm: "30.0" }
                    ].map((row) => (
                      <tr key={row.us} className="border-b border-neutral-200 last:border-0 hover:bg-neutral-100/50 transition-colors">
                        <td className="p-3 text-xs font-bold text-neutral-900">{row.us}</td>
                        <td className="p-3 text-xs font-semibold text-neutral-600">{row.ar}</td>
                        <td className="p-3 text-xs font-semibold text-neutral-600">{row.cm} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[10px] text-neutral-400 font-semibold leading-normal">
                * Recomendación: El calzado de básquetbol suele quedar más ajustado para mayor estabilidad. Si prefieres un calce holgado, te sugerimos pedir medio talle más.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Link */}
      <Link
        href="/"
        className="self-start flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al Catálogo
      </Link>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="border border-neutral-200 rounded-2xl bg-neutral-50 p-6 shadow-xs overflow-hidden aspect-square flex items-center justify-center relative"
          >
            <div className="w-full h-full rounded-xl bg-white overflow-hidden flex items-center justify-center border border-neutral-100 relative">
              <motion.img
                src={product.imageUrl}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ease-out ${viewStyles[activeView].class}`}
              />
            </div>
          </motion.div>

          {/* Thumbnails list */}
          <div className="grid grid-cols-3 gap-3">
            {viewStyles.map((view, idx) => (
              <button
                key={view.name}
                onClick={() => setActiveView(idx)}
                className={`p-2 rounded-xl border bg-neutral-50 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  activeView === idx 
                    ? 'border-neutral-900 bg-white ring-1 ring-neutral-900' 
                    : 'border-neutral-200 hover:border-neutral-400 hover:bg-neutral-100'
                }`}
              >
                <span className="text-[9px] font-bold uppercase text-neutral-400">{view.name}</span>
                <div className="w-10 h-10 overflow-hidden rounded bg-white border border-neutral-100 self-center flex items-center justify-center">
                  <img 
                    src={product.imageUrl} 
                    alt={view.name} 
                    className={`w-full h-full object-cover transition-transform ${view.class}`} 
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

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
              <div className="flex justify-between items-center mb-3">
                <span className="font-display text-xs font-extrabold uppercase tracking-wider text-neutral-950">
                  Seleccionar Talle (US)
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs font-bold text-neutral-400 hover:text-neutral-900 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Guía de talles</span>
                </button>
              </div>
              <div className="flex gap-2">
                {sizes.map((size) => {
                  const sizeStock = getSizeStock(size);
                  const isSizeUnavailable = sizeStock <= 0;

                  return (
                    <button
                      key={size}
                      disabled={isSizeUnavailable}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border rounded-lg font-display text-sm font-bold flex items-center justify-center transition-all relative cursor-pointer ${
                        isSizeUnavailable
                          ? 'bg-neutral-50 border-neutral-200 text-neutral-300 line-through cursor-not-allowed'
                          : selectedSize === size
                          ? 'bg-neutral-900 border-neutral-900 text-white'
                          : 'bg-white border-neutral-200 text-neutral-900 hover:border-neutral-900'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Inventory & CTA */}
          <div className="flex flex-col gap-4 border-t border-neutral-200 pt-6">
            
            {/* Real-time stock status */}
            <div className="text-xs font-bold flex items-center gap-2">
              {isOutOfStock ? (
                <span className="text-red-600 font-black uppercase">Sin stock temporalmente</span>
              ) : selectedSizeStock === 0 ? (
                <span className="text-red-600 font-black uppercase">Agotado en este talle</span>
              ) : selectedSizeStock <= 2 ? (
                <div className="flex items-center gap-1.5 text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="font-extrabold uppercase tracking-wide">
                    ¡Últimos {selectedSizeStock} pares en este talle!
                  </span>
                </div>
              ) : (
                <span className="text-neutral-500">
                  Estado: <span className="font-black text-green-600 uppercase">Disponible</span> (Talle US {selectedSize})
                </span>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              variant="dark"
              size="lg"
              disabled={isOutOfStock || selectedSizeStock === 0}
              className="w-full flex items-center justify-center gap-3 rounded-full py-4 border-none shadow-none hover:bg-neutral-800 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Agregar al Carrito</span>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-neutral-200 pt-12 flex flex-col gap-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600 block mb-1">
              RECOMENDADO PARA TI
            </span>
            <h2 className="font-display text-xl font-black uppercase tracking-tight text-neutral-900 leading-none">
              También te podría gustar
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

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
