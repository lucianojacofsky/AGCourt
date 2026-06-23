"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Search, Trophy, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { Product } from '@/core/types';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

const categories = ['Todos', 'Zapatillas', 'Indumentaria', 'Accesorios', 'Ofertas'];

const DEFAULT_CONFIG = {
  heroTitle: "SIEMPRE EN VUELO.",
  heroSubtitle: "Descubre las siluetas oficiales de firma diseñadas para la velocidad explosiva de Ja Morant, el poder dominante de Giannis y la mamba mentality de Kobe Bryant.",
  heroImage: "https://images.unsplash.com/photo-1504450758481-7338eaa75e6a?q=80&w=1920",
  heroCtaText: "Comprar Todo Calzado",
  heroSecondaryCtaText: "Línea Ja Morant",
  athletes: [
    {
      name: "Kobe Bryant",
      query: "Kobe Bryant",
      image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800",
      quote: "Mamba Mentality"
    },
    {
      name: "Ja Morant",
      query: "Ja Morant",
      image: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=800",
      quote: "Estilo Explosivo"
    },
    {
      name: "Giannis Antetokounmpo",
      query: "Giannis Antetokounmpo",
      image: "https://images.unsplash.com/photo-1505666287802-931dc83948e9?q=80&w=800",
      quote: "Poder Físico"
    },
    {
      name: "LeBron James",
      query: "LeBron James",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800",
      quote: "El Rey de la Cancha"
    }
  ]
};

// Separated catalog component to handle searchParams properly within Next.js Suspense
function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<typeof DEFAULT_CONFIG | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const catalogRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

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

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/homepage-config');
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
        }
      } catch (err) {
        console.error('Error al cargar config de la home:', err);
      }
    };
    fetchConfig();
  }, []);

  // Update category selection based on URL search query parameters
  useEffect(() => {
    if (categoryParam) {
      const lower = categoryParam.toLowerCase();
      if (lower === 'zapatillas') {
        setSelectedCategory('Zapatillas');
        setSearchQuery('');
      } else if (lower === 'ropa') {
        setSelectedCategory('Indumentaria');
        setSearchQuery('');
      } else if (lower === 'equipamiento') {
        setSelectedCategory('Accesorios');
        setSearchQuery('');
      } else if (lower === 'ofertas') {
        setSelectedCategory('Ofertas');
        setSearchQuery('');
      } else {
        setSelectedCategory('Todos');
      }
      
      // Smooth scroll to catalog
      catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [categoryParam]);

  const handleAthleteClick = (athleteName: string) => {
    setSelectedCategory('Zapatillas');
    setSearchQuery(athleteName);
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredProducts = products
    .filter((product) => {
      let matchesCategory = false;
      if (selectedCategory === 'Todos') {
        matchesCategory = true;
      } else if (selectedCategory === 'Ofertas') {
        matchesCategory = product.price < 130; // Mock offers for items under $130
      } else {
        matchesCategory = product.category === selectedCategory;
      }

      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === 'price-asc') return a.price - b.price;
      if (sortOrder === 'price-desc') return b.price - a.price;
      return 0;
    });

  // Hot releases slider (Zapatillas)
  const featuredProducts = products.filter((p) => p.category === 'Zapatillas');

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const activeConfig = config || DEFAULT_CONFIG;

  return (
    <div className="flex flex-col gap-24 pb-24 bg-white text-neutral-900">
      
      {/* 1. Full-Bleed High-Contrast Hero Banner (Replicating nike.com/basketball) */}
      <section className="relative h-[80vh] w-full bg-neutral-950 flex items-end overflow-hidden">
        {/* Immersive background image of a hoop at sunset */}
        <div className="absolute inset-0 z-0">
          <img 
            src={activeConfig.heroImage} 
            alt="Nike Basketball Hoop at Sunset" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
        </div>

        {/* Hero Overlay Text */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 z-10 w-full text-left">
          <div className="max-w-2xl flex flex-col gap-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 block">
              NIKE BASKETBALL
            </span>
            <h1 className="font-display text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white italic">
              {activeConfig.heroTitle}
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 font-medium max-w-lg leading-relaxed">
              {activeConfig.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <button 
                onClick={scrollToCatalog}
                className="px-6 py-3.5 bg-white text-neutral-950 hover:bg-neutral-200 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                {activeConfig.heroCtaText}
              </button>
              <button 
                onClick={() => handleAthleteClick(activeConfig.athletes[1]?.query || 'Ja Morant')}
                className="px-6 py-3.5 bg-transparent border border-white text-white hover:bg-white/10 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {activeConfig.heroSecondaryCtaText}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Athlete Collections Section ("Comprar por Atleta" Grid) */}
      <section id="atletas" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1">
            COLECCIONES EXCLUSIVAS
          </span>
          <h2 className="font-display text-2xl font-black uppercase tracking-tight text-neutral-950">
            Comprar por Atleta
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeConfig.athletes.map((ath) => (
            <div 
              key={ath.name}
              onClick={() => handleAthleteClick(ath.query)}
              className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer shadow-xs hover:shadow-md transition-all duration-300 border border-neutral-100 bg-neutral-50"
            >
              {/* Image */}
              <img 
                src={ath.image} 
                alt={ath.name} 
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[9px] font-bold uppercase tracking-widest text-orange-500 block mb-1">
                  {ath.quote}
                </span>
                <h3 className="font-display text-lg font-black uppercase tracking-tight mb-2">
                  {ath.name}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white hover:underline inline-flex items-center gap-1">
                  Comprar Colección <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Drops / Hot Releases Slider (Borderless Nike Style Carousel) */}
      {featuredProducts.length > 0 && (
        <section id="novedades" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600 block mb-1">
                NOVEDADES DESTACADAS
              </span>
              <h2 className="font-display text-2xl font-black uppercase tracking-tight text-neutral-900 leading-none">
                Lanzamientos de Élite
              </h2>
            </div>
            
            {/* Carousel navigation */}
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

          {/* Carousel Wrapper - Borderless, clean image, left aligned text */}
          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar scroll-smooth"
          >
            {featuredProducts.map((p) => (
              <div 
                key={p.id} 
                className="min-w-[260px] sm:min-w-[300px] flex-shrink-0 flex flex-col gap-3 snap-start group select-none"
              >
                {/* Image Wrapper - soft gray box, straight image */}
                <Link href={`/product/${p.id}`} className="aspect-square rounded-xl bg-neutral-50 border border-neutral-100 overflow-hidden flex items-center justify-center relative cursor-pointer">
                  <img 
                    src={p.imageUrl} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out" 
                  />
                  {p.stock <= 5 && p.stock > 0 && (
                    <div className="absolute top-3 left-3 bg-orange-600 text-white text-[8px] font-black uppercase tracking-widest px-2. py-0.5 rounded-sm">
                      Últimos Pares
                    </div>
                  )}
                </Link>

                {/* Details layout - Left Aligned */}
                <div className="flex flex-col gap-1 px-1">
                  <h3 className="font-sans text-xs font-bold text-neutral-900 uppercase tracking-tight group-hover:underline">
                    <Link href={`/product/${p.id}`} className="cursor-pointer">{p.name}</Link>
                  </h3>
                  <span className="text-[10px] text-neutral-400 font-semibold uppercase">
                    Calzado de Básquetbol
                  </span>
                  <span className="text-xs font-black text-neutral-900 mt-1">
                    ${p.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Complete Catalog Section with Left Sidebar Filters (Sleek Nike Grid) */}
      <section 
        id="catalogo"
        ref={catalogRef} 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-8 scroll-mt-24 border-t border-neutral-200 pt-16"
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1">
              COLECCIÓN COURT
            </span>
            <h2 className="font-display text-2xl font-black uppercase tracking-tight text-neutral-900 leading-none">
              Comprar Productos
            </h2>
          </div>
          
          <span className="text-xs font-bold text-neutral-400">
            {filteredProducts.length} Resultados
          </span>
        </div>

        {/* Nike Two-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar: Filters */}
          <aside className="lg:col-span-3 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-neutral-200 pb-6 lg:pb-0 lg:pr-6">
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg font-medium text-xs outline-none focus:border-neutral-900 transition-colors"
              />
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>

            {/* Category Filter List */}
            <div className="flex flex-col gap-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-2">
                Categorías
              </h3>
              <div className="flex flex-row lg:flex-col flex-wrap gap-1.5 lg:gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-lg text-left text-xs font-semibold tracking-tight transition-colors cursor-pointer w-auto lg:w-full ${
                      selectedCategory === cat
                        ? 'bg-neutral-900 text-white font-bold'
                        : 'bg-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Selector */}
            <div className="flex flex-col gap-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-2">
                Ordenar Por
              </h3>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="w-full border border-neutral-200 rounded-lg bg-white px-3 py-2 text-xs font-semibold outline-none cursor-pointer focus:border-neutral-900"
                >
                  <option value="default">Por Defecto</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                </select>
              </div>
            </div>

          </aside>

          {/* Right Column: Catalog Grid */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
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
                <p className="text-xs font-semibold text-neutral-500">
                  Intenta cambiar los filtros o realizar otra búsqueda.
                </p>
              </div>
            ) : (
              /* Completely Borderless Nike style product grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6">
                {filteredProducts.map((product) => {
                  const isOutOfStock = product.stock <= 0;
                  return (
                    <div 
                      key={product.id} 
                      className="group flex flex-col gap-3 relative overflow-hidden"
                    >
                      {/* Image container - soft gray rounded box */}
                      <Link href={`/product/${product.id}`} className="aspect-square rounded-xl bg-neutral-50 border border-neutral-100 overflow-hidden flex items-center justify-center relative cursor-pointer">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                        />
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-white/40 backdrop-blur-xs flex items-center justify-center">
                            <span className="font-display font-black text-[10px] uppercase bg-neutral-900 text-white px-3 py-1.5 tracking-wider rounded-sm shadow-sm">
                              Sin Stock
                            </span>
                          </div>
                        )}
                        {product.stock > 0 && product.stock <= 5 && (
                          <div className="absolute top-3 left-3 bg-orange-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">
                            Últimos Pares
                          </div>
                        )}
                      </Link>

                      {/* Detail text - left aligned */}
                      <div className="flex flex-col gap-0.5 px-1">
                        <h3 className="font-sans text-xs font-bold text-neutral-900 uppercase tracking-tight group-hover:underline">
                          <Link href={`/product/${product.id}`} className="cursor-pointer">{product.name}</Link>
                        </h3>
                        <span className="text-[10px] text-neutral-400 font-semibold uppercase">
                          {product.category === 'Zapatillas' ? 'Calzado de Básquetbol' : product.category === 'Indumentaria' ? 'Ropa Deportiva' : 'Accesorios'}
                        </span>
                        
                        {/* Price & CTA */}
                        <div className="flex items-center justify-between gap-4 mt-2">
                          <span className="text-xs font-black text-neutral-900">
                            ${product.price.toFixed(2)}
                          </span>

                          <button 
                            disabled={isOutOfStock}
                            onClick={() => addToCart(product, 1)}
                            className="text-[9px] font-black uppercase tracking-wider text-neutral-500 hover:text-neutral-900 cursor-pointer disabled:text-neutral-300 disabled:cursor-not-allowed transition-colors"
                          >
                            + Agregar al carrito
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>

        </div>
      </section>

    </div>
  );
}

export default function CatalogPagePage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
          Cargando tienda...
        </span>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
