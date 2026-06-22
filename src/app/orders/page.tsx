"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronRight, Package, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Order } from '@/core/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function ClientOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-3 border-neutral-200 border-t-neutral-950 rounded-full animate-spin"></div>
        <span className="font-display font-bold text-xs uppercase tracking-wider text-neutral-500">
          Cargando tus pedidos...
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center flex flex-col items-center gap-4">
        <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 border border-neutral-200">
          <Package className="w-6 h-6" />
        </div>
        <h2 className="font-display text-xl font-bold uppercase tracking-tight text-neutral-900">
          Inicia Sesión
        </h2>
        <p className="text-xs font-semibold text-neutral-500">
          Debes ingresar a tu cuenta para poder ver el historial de tus pedidos.
        </p>
        <Link href="/">
          <Button variant="dark" className="rounded-full mt-2">
            Volver al Catálogo
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 border border-neutral-200 rounded-full hover:bg-neutral-50 transition-colors">
          <ArrowLeft className="w-4 h-4 text-neutral-900" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-black uppercase tracking-tight text-neutral-900">
            Mis Pedidos
          </h1>
          <p className="text-xs font-semibold text-neutral-400 mt-1">
            Revisa el estado de tus compras y realiza el seguimiento de tus envíos.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="border border-neutral-200 rounded-2xl p-12 bg-white text-center flex flex-col items-center gap-4 shadow-xs">
          <div className="w-12 h-12 bg-neutral-50 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold uppercase text-neutral-950 mb-1">
              Aún no tienes pedidos
            </h3>
            <p className="text-xs font-semibold text-neutral-500 max-w-xs mx-auto">
              Explora nuestra colección de elite y equipamiento oficial para realizar tu primera compra.
            </p>
          </div>
          <Link href="/">
            <Button variant="dark" className="rounded-full px-6 py-2.5 mt-2">
              Explorar Catálogo
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Card 
              key={order.id} 
              className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-xs hover:border-neutral-300 transition-colors flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
            >
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="dark" className="bg-neutral-950 border-none text-white rounded-full text-[9px] py-0.5 px-2.5 uppercase font-bold">
                    Orden #{order.id.slice(0, 8).toUpperCase()}
                  </Badge>
                  <span className="text-[10px] font-semibold text-neutral-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Items preview text */}
                <p className="text-xs font-semibold text-neutral-700 mt-1">
                  {order.items.map(item => `${item.product.name} (x${item.quantity})`).join(', ')}
                </p>

                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs font-semibold text-neutral-500">
                    Total: <span className="font-bold text-neutral-900">${order.total.toFixed(2)}</span>
                  </span>
                  
                  {/* Status Badge */}
                  <div className="flex items-center gap-1.5">
                    {order.status === 'PENDING_CONFIRMATION' && <Badge variant="orange" className="bg-amber-500 border-none text-white rounded-full text-[8px] py-0.5 px-2 font-bold">Pendiente de Pago</Badge>}
                    {order.status === 'CONFIRMED' && <Badge variant="dark" className="bg-green-600 border-none text-white rounded-full text-[8px] py-0.5 px-2 font-bold">Confirmado</Badge>}
                    {order.status === 'SHIPPED' && <Badge variant="dark" className="bg-blue-600 border-none text-white rounded-full text-[8px] py-0.5 px-2 font-bold">En Camino</Badge>}
                    {order.status === 'DELIVERED' && <Badge variant="dark" className="bg-neutral-900 border-none text-white rounded-full text-[8px] py-0.5 px-2 font-bold">Entregado</Badge>}
                  </div>
                </div>
              </div>

              <Link href={`/order-tracking/${order.id}`} className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto rounded-full border border-neutral-200 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:bg-neutral-50 flex items-center justify-center gap-1"
                >
                  <span>Seguir Envío</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
