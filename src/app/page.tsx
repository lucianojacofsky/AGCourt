"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Search, Trophy, Zap, Compass, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { Product } from '@/core/types';
import { ProductCard } from '@/components/ecommerce/ProductCard';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const catalogRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  // Get first 3 sneakers for the featured carousel
  const featuredProducts = products
    .filter((p) => p.category === 'Zapatillas')
    .slice(0, 3);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="flex flex-col gap-20 pb-20 overflow-x-hidden bg-white text-neutral-900">
      
      {/* 1. Immersive Hero Section (Sleek Nike Style - Light Theme for Perfect Image Blending) */}
      <section className="relative bg-neutral-50 min-h-[70vh] flex items-center overflow-hidden border-b border-neutral-200">
        {/* Soft background light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-neutral-100 via-neutral-50 to-white z-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-12 items-center z-10 w-full">
          {/* Left Column: Heavy Typography */}
          <div className="md:col-span-7 flex flex-col gap-6 text-left">
            <div>
              <Badge className="bg-neutral-900 text-white rounded-full py-1 px-4 text-[9px] font-black uppercase tracking-widest inline-block mb-4">
                NUEVA TEMPORADA 2026
              </Badge>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.95] flex flex-col text-neutral-900">
                <span>CORTA EL VIENTO.</span>
                <span className="text-orange-600">DOMINA LA CANCHA.</span>
              </h1>
            </div>
            <p className="text-sm sm:text-base text-neutral-500 font-medium max-w-lg leading-relaxed">
              Equipamiento técnico premium desarrollado para atletas de élite. Descubre la línea oficial de calzado e indumentaria con tracción absoluta y amortiguación reactiva.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <button 
                onClick={scrollToCatalog}
                className="px-8 py-4 bg-neutral-900 text-white hover:bg-neutral-800 rounded-full font-display text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                Comprar Colección
              </button>
            </div>
          </div>

          {/* Right Column: Clean Premium Product Image (No rotation) */}
          <div className="md:col-span-5 flex justify-center items-center">
            {featuredProducts[0] && (
              <div className="relative border border-neutral-200 bg-white rounded-2xl p-4 shadow-md max-w-sm w-full aspect-square flex items-center justify-center">
                <img 
                  src={featuredProducts[0].imageUrl} 
                  alt="Sneaker Hero" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Infinite Text Marquee (Sleek & Clean) */}
      <div className="bg-white border-y border-neutral-200 py-4 overflow-hidden relative select-none">
        <div className="animate-marquee flex gap-12 whitespace-nowrap">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="font-display text-xs sm:text-sm font-black uppercase tracking-widest text-neutral-400 flex items-center gap-12">
              <span>COURT PERFORMANCE</span>
              <span className="text-orange-600">•</span>
              <span>ELITE LEVEL GEAR</span>
              <span className="text-orange-600">•</span>
              <span>UNLEASH SPEED</span>
              <span className="text-orange-600">•</span>
              <span>BECOME THE LEGEND</span>
              <span className="text-orange-600">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* 3. Featured Drops Pasarela (Carousel - Light Cards for Image Blending) */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600 block mb-1">
                LANZAMIENTOS CLAVE
              </span>
              <h2 className="font-display text-2xl font-black uppercase tracking-tight text-neutral-900 leading-none">
                Lanzamientos de Élite
              </h2>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex gap-2">
              <button 
                onClick={() => scrollCarousel('left')}
                className="p-2 border border-neutral-200 rounded-full hover:bg-neutral-50 text-neutral-900 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scrollCarousel('right')}
                className="p-2 border border-neutral-200 rounded-full hover:bg-neutral-50 text-neutral-900 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sliding container */}
          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar scroll-smooth"
          >
            {featuredProducts.map((p) => (
              <div 
                key={p.id} 
                className="min-w-[300px] sm:min-w-[360px] flex-shrink-0 bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between relative snap-start group shadow-xs hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-orange-600 block mb-1">
                      SIGNATURE MODEL
                    </span>
                    <h3 className="font-display text-base font-extrabold uppercase tracking-tight text-neutral-900 line-clamp-1">
                      {p.name}
                    </h3>
                  </div>
                  <span className="font-display text-sm font-bold bg-neutral-100 text-neutral-900 px-3 py-1 rounded-md">
                    ${p.price.toFixed(2)}
                  </span>
                </div>

                {/* Center Image - Straight, no rotation, clean blending */}
                <div className="my-6 aspect-square rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                  <img 
                    src={p.imageUrl} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out" 
                  />
                </div>

                {/* Footer Link */}
                <Link href={`/product/${p.id}`} className="mt-auto">
                  <button className="w-full py-3 bg-neutral-900 text-white hover:bg-neutral-800 rounded-full font-display text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1">
                    <span>Ver Detalles</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Bento Grid (Technology & Details - Clean Consistent Light Theme) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600 block mb-1">
            INGENIERÍA E INNOVACIÓN
          </span>
          <h2 className="font-display text-2xl font-black uppercase tracking-tight text-neutral-900 leading-none">
            Diseño para el Rendimiento
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: Reactivity */}
          <div className="md:col-span-2 border border-neutral-200 bg-neutral-50 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 justify-between items-center overflow-hidden hover:border-neutral-300 transition-colors shadow-xs group">
            <div className="flex flex-col gap-3 max-w-sm">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-extrabold uppercase tracking-tight mt-2 text-neutral-900">
                REACTIVIDAD TOTAL (Zoom Air)
              </h3>
              <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                Cápsulas de aire presurizado en la suela del calzado que absorben el impacto de tus saltos y devuelven la energía en forma de explosión y propulsión inmediata.
              </p>
            </div>
            
            {/* Tech illustration */}
            <div className="w-48 h-32 bg-white border border-neutral-200 rounded-xl relative overflow-hidden flex items-center justify-center">
              <span className="font-display font-black text-[10px] text-orange-600/30 uppercase tracking-widest animate-pulse">
                AIR CHAMBER
              </span>
              <div className="absolute bottom-2 left-2 right-2 h-1 bg-orange-100 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-orange-500" />
              </div>
            </div>
          </div>

          {/* Card 2: Traction */}
          <div className="border border-neutral-200 bg-white rounded-2xl p-6 sm:p-8 flex flex-col gap-4 justify-between hover:border-neutral-300 transition-colors shadow-xs">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-900">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-extrabold uppercase tracking-tight mt-2 text-neutral-900">
                TRACCIÓN 360°
              </h3>
              <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                Patrón de suela de caucho diseñado por algoritmo que provee máximo grip lateral. Ideal para frenadas bruscas y fintas explosivas sin pérdida de balance.
              </p>
            </div>
            <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">
              Traction Grid Optimized
            </span>
          </div>

          {/* Card 3: Support */}
          <div className="border border-neutral-200 bg-white rounded-2xl p-6 sm:p-8 flex flex-col gap-4 justify-between hover:border-neutral-300 transition-colors shadow-xs">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-900">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-extrabold uppercase tracking-tight mt-2 text-neutral-900">
                MALLA DE CONTENCIÓN
              </h3>
              <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                Exterior estructurado con tejidos de filamento ultrafuerte. Mantiene el pie fijo en la plantilla protegiendo los tobillos en despegues pesados.
              </p>
            </div>
            <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">
              Ultralight Shield v4
            </span>
          </div>
        </div>
      </section>

      {/* 5. Complete Catalog (Grid section) */}
      <section ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-8 scroll-mt-24">
        <div className="border-t border-neutral-200 pt-12 flex flex-col gap-6">
          
          {/* Header Title */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600 block mb-1">
              COLECCIÓN COMPLETA
            </span>
            <h2 className="font-display text-2xl font-black uppercase tracking-tight text-neutral-900 leading-none">
              Catálogo de Productos
            </h2>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between border border-neutral-200 bg-white rounded-2xl p-4 shadow-xs">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar zapatillas, indumentaria..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-full font-medium text-xs outline-none focus:border-neutral-900 transition-colors"
              />
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>

            {/* Categories Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-neutral-950 text-white'
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
                className="border border-neutral-200 rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-wider outline-none cursor-pointer focus:border-neutral-900"
              >
                <option value="default">Por Defecto</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-neutral-200 border-t-neutral-950 rounded-full animate-spin"></div>
            <span className="font-display font-black text-xs uppercase tracking-wider text-neutral-500">
              Cargando catálogo...
            </span>
          </div>
        ) : error ? (
          <div className="py-20 border border-neutral-200 rounded-2xl bg-red-50/50 text-center p-8">
            <Trophy className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="font-display text-base font-bold uppercase text-red-600 mb-2">
              Error de Conexión
            </h3>
            <p className="text-xs font-semibold text-neutral-600">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 border border-neutral-200 rounded-2xl bg-white text-center p-8 shadow-xs">
            <h3 className="font-display text-base font-bold uppercase text-neutral-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-xs font-semibold text-neutral-500">
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
      </section>
    </div>
  );
}
