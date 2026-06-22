"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/core/types';
import { useCart } from '@/hooks/useCart';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="group relative flex flex-col justify-between border border-neutral-200 bg-white rounded-xl shadow-xs hover:shadow-lg transition-all duration-300 h-full p-4 overflow-hidden"
    >
      <div>
        {/* Category Badge & Clickable Image */}
        <Link href={`/product/${product.id}`} className="block relative aspect-square border border-neutral-100 bg-neutral-50 rounded-lg overflow-hidden mb-4 cursor-pointer">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="dark" className="bg-neutral-900/90 text-white border-none py-1 px-2.5 rounded-sm lowercase first-letter:uppercase text-[9px]">
              {product.category}
            </Badge>
          </div>
          {isOutOfStock ? (
            <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center">
              <span className="font-display font-black text-xs uppercase bg-neutral-900 text-white px-3 py-1.5 tracking-wider rounded-sm">
                Sin Stock
              </span>
            </div>
          ) : isLowStock ? (
            <div className="absolute top-3 right-3">
              <Badge variant="orange" className="bg-orange-600 text-white border-none py-1 px-2.5 rounded-sm text-[9px]">
                Últimas {product.stock}
              </Badge>
            </div>
          ) : null}
        </Link>

        {/* Product Details */}
        <h3 className="font-display text-sm font-bold uppercase tracking-tight text-neutral-900 mb-1.5 group-hover:text-orange-600 transition-colors">
          <Link href={`/product/${product.id}`} className="cursor-pointer">{product.name}</Link>
        </h3>
        <p className="text-xs text-neutral-500 line-clamp-2 mb-4 h-8 font-normal leading-relaxed">
          {product.description}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-neutral-100">
        <span className="font-display text-base font-black text-neutral-900">
          ${product.price.toFixed(2)}
        </span>

        <Button
          onClick={() => addToCart(product)}
          variant="dark"
          size="sm"
          disabled={isOutOfStock}
          className="rounded-full py-2 px-4 shadow-none hover:bg-neutral-800 border-none transition-all"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">Agregar</span>
        </Button>
      </div>
    </motion.div>
  );
};
