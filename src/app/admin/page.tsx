"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Edit2, Trash2, Check, Truck, PackageCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Product, Order, OrderStatus } from '@/core/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  
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

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchProducts();
      fetchOrders();
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
        <div className="flex border border-neutral-200 bg-white rounded-full p-1 shadow-xs">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-5 py-2 rounded-full font-display text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'inventory' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Inventario
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2 rounded-full font-display text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Pedidos
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'inventory' ? (
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
                          Stock: <span className="font-bold text-neutral-900">{p.stock}</span> • Precio: <span className="font-bold text-neutral-900">${p.price.toFixed(2)}</span>
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
      ) : (
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
                          <span className="text-[10px] font-semibold text-neutral-400">
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
    </div>
  );
}
