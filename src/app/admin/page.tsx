"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Edit2, Trash2, Check, Truck, PackageCheck, Users, Settings, DollarSign, TrendingUp, AlertTriangle, RotateCcw, Calendar, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Product, Order, OrderStatus } from '@/core/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'orders' | 'users' | 'design'>('dashboard');
  
  // Inventory state
  const [products, setProducts] = useState<Product[]>([]);
  const [invLoading, setInvLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  
  // Product form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formCategory, setFormCategory] = useState('Zapatillas');

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Users management state
  const [usersList, setUsersList] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userActionLoading, setUserActionLoading] = useState<string | null>(null);

  // Homepage Design Config state
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [heroCtaText, setHeroCtaText] = useState('');
  const [heroSecondaryCtaText, setHeroSecondaryCtaText] = useState('');
  const [athletesConfig, setAthletesConfig] = useState<any[]>([]);
  const [designLoading, setDesignLoading] = useState(true);
  const [savingDesign, setSavingDesign] = useState(false);

  // Fetch functions
  const fetchProducts = async () => {
    try {
      setInvLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setInvLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchDesignConfig = async () => {
    try {
      setDesignLoading(true);
      const res = await fetch('/api/homepage-config');
      if (res.ok) {
        const data = await res.json();
        setHeroTitle(data.heroTitle);
        setHeroSubtitle(data.heroSubtitle);
        setHeroImage(data.heroImage);
        setHeroCtaText(data.heroCtaText);
        setHeroSecondaryCtaText(data.heroSecondaryCtaText);
        setAthletesConfig(data.athletes);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDesignLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchProducts();
      fetchOrders();
      fetchUsers();
      fetchDesignConfig();
    }
  }, [user]);

  // Inventory handlers
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formName,
      description: formDescription,
      price: parseFloat(formPrice),
      stock: parseInt(formStock),
      imageUrl: formImageUrl,
      category: formCategory,
    };

    try {
      let res;
      if (isEditing && currentProductId) {
        res = await fetch(`/api/products/${currentProductId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        resetForm();
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditClick = (p: Product) => {
    setIsEditing(true);
    setCurrentProductId(p.id);
    setFormName(p.name);
    setFormDescription(p.description);
    setFormPrice(p.price.toString());
    setFormStock(p.stock.toString());
    setFormImageUrl(p.imageUrl);
    setFormCategory(p.category);
  };

  const handleDeleteClick = async (productId: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProductId(null);
    setFormName('');
    setFormDescription('');
    setFormPrice('');
    setFormStock('');
    setFormImageUrl('');
    setFormCategory('Zapatillas');
  };

  // Orders handlers
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setActionLoading(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  // User Role handlers
  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`¿Estás seguro de cambiar el rol de este usuario a ${newRole}?`)) return;
    
    setUserActionLoading(userId);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || 'Error al actualizar rol.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUserActionLoading(null);
    }
  };

  // Design Config Handlers
  const handleAthleteConfigChange = (index: number, key: string, value: string) => {
    const updated = [...athletesConfig];
    updated[index] = { ...updated[index], [key]: value };
    setAthletesConfig(updated);
  };

  const handleSaveDesign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingDesign(true);
    const payload = {
      heroTitle,
      heroSubtitle,
      heroImage,
      heroCtaText,
      heroSecondaryCtaText,
      athletes: athletesConfig
    };
    try {
      const res = await fetch('/api/homepage-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert('Configuración de la página de inicio guardada con éxito.');
      } else {
        const err = await res.json();
        alert(err.error || 'Error al guardar la configuración.');
      }
    } catch (e) {
      console.error(e);
      alert('Error en el servidor al intentar guardar.');
    } finally {
      setSavingDesign(false);
    }
  };

  // Dashboard Stats Calculations
  const totalSales = orders
    .filter((o) => o.status !== 'PENDING_CONFIRMATION')
    .reduce((acc, o) => acc + o.total, 0);

  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const productSalesMap: Record<string, { name: string; quantity: number }> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = { name: item.product.name, quantity: 0 };
      }
      productSalesMap[item.productId].quantity += item.quantity;
    });
  });

  const topProduct = Object.values(productSalesMap).sort((a, b) => b.quantity - a.quantity)[0] || { name: 'N/A', quantity: 0 };

  const pendingCount = orders.filter((o) => o.status === 'PENDING_CONFIRMATION').length;
  const confirmedCount = orders.filter((o) => o.status === 'CONFIRMED').length;
  const shippedCount = orders.filter((o) => o.status === 'SHIPPED').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;

  if (authLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-3 border-neutral-200 border-t-neutral-950 rounded-full animate-spin"></div>
        <span className="font-display font-bold text-xs uppercase tracking-wider text-neutral-500">
          Cargando panel...
        </span>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 flex flex-col justify-center items-stretch animate-fade-in">
        <Card className="border border-neutral-200 rounded-2xl p-8 bg-white shadow-md text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-600">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="font-display text-xl font-bold uppercase tracking-tight text-neutral-900">
            Acceso Denegado
          </h2>
          <p className="text-xs font-semibold text-neutral-500">
            Debes iniciar sesión con una cuenta de Administrador para poder ver este panel de gestión.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 animate-fade-in">
      
      {/* Title & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="dark" className="bg-neutral-950 text-white rounded-full border-none py-1 px-3 text-[9px] font-black uppercase">
              Administración
            </Badge>
          </div>
          <h1 className="font-display text-2xl font-black uppercase tracking-tight text-neutral-900 leading-none">
            Panel de Control
          </h1>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap border border-neutral-200 bg-white rounded-2xl p-1 shadow-xs gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'inventory' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Inventario
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Pedidos
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'users' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Usuarios
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`px-4 py-2 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'design' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Personalizar
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'dashboard' && (
        /* Dashboard Tab */
        <div className="flex flex-col gap-8">
          
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-neutral-400 block">Ventas Recaudadas</span>
                <span className="font-display font-black text-xl text-neutral-900">${totalSales.toFixed(2)}</span>
              </div>
            </Card>

            <Card className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-neutral-400 block">Total Pedidos</span>
                <span className="font-display font-black text-xl text-neutral-900">{orders.length} órdenes</span>
              </div>
            </Card>

            <Card className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase text-neutral-400 block">Producto Estrella</span>
                <span className="font-sans font-bold text-xs text-neutral-900 block truncate" title={topProduct.name}>
                  {topProduct.name}
                </span>
                {topProduct.quantity > 0 && (
                  <span className="text-[9px] text-neutral-400 font-semibold uppercase">{topProduct.quantity} vendidos</span>
                )}
              </div>
            </Card>

            <Card className={`border rounded-2xl p-5 bg-white shadow-xs flex items-center gap-4 ${lowStockProducts.length > 0 ? 'border-red-200 bg-red-50/10' : 'border-neutral-200'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${lowStockProducts.length > 0 ? 'bg-red-100 text-red-600' : 'bg-neutral-100 text-neutral-600'}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-neutral-400 block">Alerta de Stock</span>
                <span className="font-display font-black text-xl text-neutral-900">
                  {lowStockProducts.length} críticos
                </span>
              </div>
            </Card>
          </div>

          {/* Detailed Statistics Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Orders logistics status breakdown */}
            <Card className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs flex flex-col gap-4">
              <h3 className="font-display text-sm font-bold uppercase text-neutral-900 border-b border-neutral-100 pb-2">
                Logística de Pedidos
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-neutral-500">Pendiente de Pago:</span>
                  <span className="font-bold text-amber-500">{pendingCount}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-neutral-500">Pago Confirmado:</span>
                  <span className="font-bold text-green-600">{confirmedCount}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-neutral-500">Despachados:</span>
                  <span className="font-bold text-blue-600">{shippedCount}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-neutral-500">Entregados:</span>
                  <span className="font-bold text-neutral-900">{deliveredCount}</span>
                </div>
              </div>
            </Card>

            {/* Low stock alerts detailed list */}
            <Card className="lg:col-span-2 border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs flex flex-col gap-4">
              <h3 className="font-display text-sm font-bold uppercase text-neutral-900 border-b border-neutral-100 pb-2 flex items-center justify-between">
                <span>Detalle de Stock Crítico (≤ 5 pares)</span>
                {lowStockProducts.length > 0 && <span className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">{lowStockProducts.length} productos</span>}
              </h3>

              {lowStockProducts.length === 0 ? (
                <div className="py-8 text-center text-xs font-semibold text-neutral-400">
                  ¡Excelente! Todos los productos tienen suficiente stock en almacén.
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-4 p-2.5 border border-red-100 rounded-xl bg-red-50/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 flex-shrink-0">
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase text-neutral-900 truncate max-w-[200px] sm:max-w-md">
                            {p.name}
                          </h4>
                          <span className="text-[9px] text-neutral-400 font-semibold uppercase">{p.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-red-600 bg-red-100/50 px-2.5 py-1 rounded-full">
                          {p.stock} unidades
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        /* Inventory Tab */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* CRUD Form */}
          <Card className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs">
            <h3 className="font-display text-base font-bold uppercase tracking-tight text-neutral-900 mb-4 border-b border-neutral-100 pb-2">
              {isEditing ? 'Editar Producto' : 'Añadir Producto'}
            </h3>

            <form onSubmit={handleProductSubmit} className="flex flex-col gap-4">
              <Input
                label="Nombre del Producto"
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ej. Nike Air Zoom"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Precio ($)"
                  type="number"
                  step="0.01"
                  required
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="199.99"
                />
                <Input
                  label="Stock"
                  type="number"
                  required
                  value={formStock}
                  onChange={(e) => setFormStock(e.target.value)}
                  placeholder="10"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Categoría
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="neo-border bg-white rounded-lg px-3 py-2.5 text-sm font-semibold outline-none focus:border-neutral-900 cursor-pointer"
                >
                  <option value="Zapatillas">Zapatillas</option>
                  <option value="Indumentaria">Indumentaria</option>
                  <option value="Accesorios">Accesorios</option>
                </select>
              </div>

              <Input
                label="URL de Imagen"
                type="url"
                required
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Descripción
                </label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detalles del producto..."
                  className="neo-border bg-white rounded-lg p-3 text-sm font-semibold outline-none resize-none focus:border-neutral-900"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <Button type="submit" variant="dark" className="w-full mt-2 rounded-full border-none py-3 shadow-none hover:bg-neutral-800 transition-colors">
                  {isEditing ? 'Guardar Cambios' : 'Añadir Producto'}
                </Button>
                {isEditing && (
                  <Button type="button" variant="outline" className="rounded-full py-3" onClick={resetForm}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Inventory List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {invLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-2 bg-white border border-neutral-200 rounded-2xl shadow-xs">
                <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-950 rounded-full animate-spin"></div>
                <span className="text-xs font-bold text-neutral-400">Cargando inventario...</span>
              </div>
            ) : products.length === 0 ? (
              <Card className="p-8 text-center bg-white shadow-xs border border-neutral-200 rounded-2xl">
                <span className="font-display font-bold text-sm uppercase text-neutral-400">Sin productos registrados</span>
              </Card>
            ) : (
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2 no-scrollbar">
                {products.map((p) => (
                  <Card key={p.id} className="border border-neutral-200 rounded-2xl p-4 bg-white shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 flex-shrink-0">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-sm font-bold uppercase text-neutral-900">
                            {p.name}
                          </h4>
                          <Badge variant="dark" className="bg-neutral-900 text-white rounded-full border-none py-0.5 px-2 text-[8px] lowercase first-letter:uppercase">{p.category}</Badge>
                        </div>
                        <p className="text-xs text-neutral-400 font-semibold mt-1">
                          Stock: <span className={`font-bold ${p.stock <= 5 ? 'text-red-600' : 'text-neutral-900'}`}>{p.stock}</span> • Precio: <span className="font-bold text-neutral-900">${p.price.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="p-2.5 border border-neutral-200 rounded-full bg-white hover:bg-neutral-50 text-neutral-900 cursor-pointer transition-colors shadow-xs"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(p.id)}
                        className="p-2.5 border border-neutral-200 rounded-full bg-white hover:bg-red-50 hover:border-red-200 text-red-600 cursor-pointer transition-colors shadow-xs"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        /* Orders Tab */
        <div className="flex flex-col gap-6">
          {ordersLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 bg-white border border-neutral-200 rounded-2xl shadow-xs">
              <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-950 rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-neutral-400">Cargando pedidos...</span>
            </div>
          ) : orders.length === 0 ? (
            <Card className="p-8 text-center bg-white shadow-xs border border-neutral-200 rounded-2xl">
              <span className="font-display font-bold text-sm uppercase text-neutral-400">No hay pedidos registrados</span>
            </Card>
          ) : (
            <div className="flex flex-col gap-6">
              {orders.map((order) => {
                const isActionLoading = actionLoading === order.id;

                return (
                  <Card key={order.id} className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant="orange" className="bg-neutral-900 border-none text-white rounded-full py-0.5 px-2.5 text-[9px]">
                            Orden # {order.id.slice(0, 8).toUpperCase()}
                          </Badge>
                          <span className="text-[10px] font-semibold text-neutral-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-neutral-600">
                          Comprador: <span className="font-bold text-neutral-900">{order.user.name}</span> ({order.user.email})
                        </span>
                      </div>

                      {/* Current Status Badge */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-neutral-400">Estado:</span>
                        {order.status === 'PENDING_CONFIRMATION' && <Badge variant="dark" className="bg-amber-500 border-none text-white rounded-full text-[9px] py-0.5 px-2.5">Pendiente de Pago</Badge>}
                        {order.status === 'CONFIRMED' && <Badge variant="dark" className="bg-green-600 border-none text-white rounded-full text-[9px] py-0.5 px-2.5">Pago Confirmado</Badge>}
                        {order.status === 'SHIPPED' && <Badge variant="dark" className="bg-blue-600 border-none text-white rounded-full text-[9px] py-0.5 px-2.5">Despachado</Badge>}
                        {order.status === 'DELIVERED' && <Badge variant="dark" className="bg-neutral-900 border-none text-white rounded-full text-[9px] py-0.5 px-2.5">Entregado</Badge>}
                      </div>
                    </div>

                    {/* Items and Actions */}
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                      {/* Items */}
                      <div className="flex-1 flex flex-col gap-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 border border-neutral-200 rounded-lg overflow-hidden flex-shrink-0">
                              <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold uppercase text-neutral-900 max-w-[260px] truncate">
                                {item.product.name}
                              </h5>
                              <span className="text-[10px] text-neutral-400 font-semibold uppercase">
                                Cant: {item.quantity} • ${item.price.toFixed(2)} c/u
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total and CTA Button */}
                      <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-4 items-stretch sm:items-center md:items-end justify-between border-t sm:border-t-0 border-neutral-100 pt-4 sm:pt-0">
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase text-neutral-400 block">Total:</span>
                          <span className="font-display font-black text-lg text-neutral-900">${order.total.toFixed(2)}</span>
                        </div>

                        {/* Order Operations */}
                        <div className="flex gap-2">
                          {order.status === 'PENDING_CONFIRMATION' && (
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                              variant="dark"
                              size="sm"
                              disabled={isActionLoading}
                              className="flex items-center gap-1.5 rounded-full border-none px-4 py-2 text-[10px] hover:bg-neutral-800"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Confirmar Pago</span>
                            </Button>
                          )}
                          {order.status === 'CONFIRMED' && (
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                              variant="dark"
                              size="sm"
                              disabled={isActionLoading}
                              className="flex items-center gap-1.5 bg-neutral-900 text-white rounded-full border-none px-4 py-2 text-[10px] hover:bg-neutral-800"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Despachar</span>
                            </Button>
                          )}
                          {order.status === 'SHIPPED' && (
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                              variant="dark"
                              size="sm"
                              disabled={isActionLoading}
                              className="flex items-center gap-1.5 bg-neutral-900 text-white rounded-full border-none px-4 py-2 text-[10px] hover:bg-neutral-800"
                            >
                              <PackageCheck className="w-3.5 h-3.5" />
                              <span>Entregar</span>
                            </Button>
                          )}
                          {order.status === 'DELIVERED' && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-green-600 bg-green-50 border border-green-200 rounded-full px-3.5 py-1.5">
                              <Check className="w-3.5 h-3.5" />
                              <span>Completado</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        /* Users Tab */
        <Card className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <h3 className="font-display text-base font-bold uppercase tracking-tight text-neutral-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-neutral-600" />
              <span>Gestión de Usuarios y Roles</span>
            </h3>
            <span className="text-xs font-bold text-neutral-400">{usersList.length} Registrados</span>
          </div>

          {usersLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-950 rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-neutral-400">Cargando lista de usuarios...</span>
            </div>
          ) : usersList.length === 0 ? (
            <div className="py-8 text-center text-xs font-semibold text-neutral-400">
              No hay otros usuarios registrados en el sistema.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Usuario</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Registro</th>
                    <th className="py-3 px-4 text-center">Pedidos</th>
                    <th className="py-3 px-4">Rol</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                  {usersList.map((u) => {
                    const isToggling = userActionLoading === u.id;
                    const isSelf = u.id === user.id;

                    return (
                      <tr key={u.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-neutral-900">{u.name}</td>
                        <td className="py-3 px-4">{u.email}</td>
                        <td className="py-3 px-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-center">{u.orderCount}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-600'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            disabled={isToggling || isSelf}
                            onClick={() => handleToggleUserRole(u.id, u.role)}
                            className="text-[10px] font-black uppercase tracking-wider bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 px-3 py-1.5 rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed"
                            title={isSelf ? "No puedes cambiar tu propio rol" : "Alternar Rol"}
                          >
                            {isToggling ? 'Cambiando...' : u.role === 'ADMIN' ? 'Revocar Admin' : 'Hacer Admin'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'design' && (
        /* Customize/Design Tab */
        <Card className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
            <h3 className="font-display text-base font-bold uppercase tracking-tight text-neutral-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-neutral-600" />
              <span>Personalización de Portada en Vivo</span>
            </h3>
            <span className="text-[10px] font-black uppercase text-orange-600">Home Customizer</span>
          </div>

          {designLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-950 rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-neutral-400">Cargando configuración de diseño...</span>
            </div>
          ) : (
            <form onSubmit={handleSaveDesign} className="flex flex-col gap-8">
              
              {/* Section 1: Hero Banner Config */}
              <div className="flex flex-col gap-4 border-b border-neutral-100 pb-6">
                <h4 className="font-display text-sm font-black uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  Sección Principal (Hero Banner)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Título de Portada"
                    type="text"
                    required
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    placeholder="Ej. SIEMPRE EN VUELO."
                  />
                  <Input
                    label="URL de Imagen de Fondo (Hero)"
                    type="url"
                    required
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Texto Botón Primario (CTA)"
                    type="text"
                    required
                    value={heroCtaText}
                    onChange={(e) => setHeroCtaText(e.target.value)}
                    placeholder="Comprar Todo Calzado"
                  />
                  <Input
                    label="Texto Botón Secundario (CTA)"
                    type="text"
                    required
                    value={heroSecondaryCtaText}
                    onChange={(e) => setHeroSecondaryCtaText(e.target.value)}
                    placeholder="Línea Ja Morant"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Subtítulo / Descripción
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    placeholder="Describe la colección principal..."
                    className="neo-border bg-white rounded-lg p-3 text-sm font-semibold outline-none resize-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Section 2: Athletes Config */}
              <div className="flex flex-col gap-6">
                <h4 className="font-display text-sm font-black uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  Grilla de Deportistas Destacados
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {athletesConfig.map((ath, idx) => (
                    <Card key={idx} className="border border-neutral-100 p-4 bg-neutral-50/50 rounded-xl flex flex-col gap-3">
                      <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                        <span className="font-display text-xs font-black uppercase text-neutral-900">Deportista #{idx + 1}</span>
                        <Badge variant="dark" className="bg-neutral-950 text-white rounded-md border-none text-[8px] py-0.5 px-2">{ath.name}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Nombre Visible"
                          type="text"
                          required
                          value={ath.name}
                          onChange={(e) => handleAthleteConfigChange(idx, 'name', e.target.value)}
                        />
                        <Input
                          label="Consulta del Buscador"
                          type="text"
                          required
                          value={ath.query}
                          onChange={(e) => handleAthleteConfigChange(idx, 'query', e.target.value)}
                        />
                      </div>

                      <Input
                        label="URL de Imagen"
                        type="url"
                        required
                        value={ath.image}
                        onChange={(e) => handleAthleteConfigChange(idx, 'image', e.target.value)}
                      />

                      <Input
                        label="Frase / Lema"
                        type="text"
                        required
                        value={ath.quote}
                        onChange={(e) => handleAthleteConfigChange(idx, 'quote', e.target.value)}
                      />
                    </Card>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 border-t border-neutral-100 pt-6">
                <Button
                  type="submit"
                  disabled={savingDesign}
                  variant="dark"
                  className="rounded-full border-none py-3 px-6 shadow-none hover:bg-neutral-800 transition-colors w-auto flex items-center gap-1.5"
                >
                  {savingDesign ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Configuración</span>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={fetchDesignConfig}
                  variant="outline"
                  className="rounded-full py-3"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Descartar Cambios
                </Button>
              </div>

            </form>
          )}
        </Card>
      )}

    </div>
  );
}

