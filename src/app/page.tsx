"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Search, Trophy } from 'lucide-react';
import { Product } from '@/core/types';
import { ProductCard } from '@/components/ecommerce/ProductCard';
import { Badge } from '@/components/ui/Badge';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Error al cargar productos');
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Error al conectar con la base de datos');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['Todos', 'Zapatillas', 'Indumentaria', 'Accesorios'];

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === 'price-asc') return a.price - b.price;
      if (sortOrder === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
      
      {/* Sleek Modern Hero Banner (Nike Inspired) */}
      <div className="relative border border-neutral-200 bg-neutral-950 text-white rounded-2xl p-8 sm:p-12 md:p-16 flex flex-col justify-center min-h-[350px] overflow-hidden shadow-sm">
        {/* Soft background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black z-0 pointer-events-none" />
        
        {/* Subtle geometric line overlay for modern vibe */}
        <div className="absolute right-0 bottom-0 opacity-5 select-none pointer-events-none translate-x-12 translate-y-12">
          <Trophy className="w-96 h-96" />
        </div>

        <div className="z-10 max-w-xl">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600 block mb-3">
            EQUIPAMIENTO PROFESIONAL
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none mb-4">
            SUPERA LA GRAVEDAD
          </h1>
          <p className="text-sm text-neutral-400 font-medium leading-relaxed mb-6">
            Eleva tu juego con el calzado oficial de firma. Ja Morant, Giannis, Kobe y LeBron. Diseñados para tracción total, amortiguación máxima y control absoluto en la cancha.
          </p>
        </div>
      </div>

      {/* Modern Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border border-neutral-200 bg-white rounded-xl p-4 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar zapatillas, indumentaria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-full font-medium text-sm outline-none focus:border-neutral-900 transition-colors"
          />
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        </div>

        {/* Categories Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="border border-neutral-200 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer focus:border-neutral-900"
          >
            <option value="default">Por Defecto</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
          <span className="font-display font-bold text-xs uppercase tracking-wider text-neutral-500">
            Cargando catálogo...
          </span>
        </div>
      ) : error ? (
        <div className="py-20 border border-neutral-200 rounded-2xl bg-red-50/50 text-center p-8">
          <h3 className="font-display text-base font-bold uppercase text-red-600 mb-2">
            Error de Conexión
          </h3>
          <p className="text-xs font-medium text-neutral-600">{error}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 border border-neutral-200 rounded-2xl bg-white text-center p-8 shadow-xs">
          <h3 className="font-display text-base font-bold uppercase text-neutral-900 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-xs font-medium text-neutral-500">
            Intenta cambiar los filtros o realizar otra búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
