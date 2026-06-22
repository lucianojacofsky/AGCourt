"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Package, CheckCircle, Truck, ShoppingBag, Clock } from 'lucide-react';
import { Order, OrderStatus } from '@/core/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Props {
  order: Order;
}

export default function OrderTrackingClient({ order }: Props) {
  const router = useRouter();

  const statuses: { value: OrderStatus; label: string; description: string; icon: any; color: string; textColor: string }[] = [
    {
      value: 'PENDING_CONFIRMATION',
      label: 'Recibido',
      description: 'Tu pedido está siendo procesado',
      icon: Clock,
      color: 'bg-amber-500',
      textColor: 'text-amber-500',
    },
    {
      value: 'CONFIRMED',
      label: 'Confirmado',
      description: 'Pago recibido correctamente',
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-500',
    },
    {
      value: 'SHIPPED',
      label: 'En Camino',
      description: 'El paquete está en tránsito',
      icon: Truck,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
    },
    {
      value: 'DELIVERED',
      label: 'Entregado',
      description: 'Paquete entregado con éxito',
      icon: Package,
      color: 'bg-neutral-900',
      textColor: 'text-neutral-900',
    },
  ];

  const getStatusIndex = (currentStatus: OrderStatus) => {
    return statuses.findIndex((s) => s.value === currentStatus);
  };

  const currentIndex = getStatusIndex(order.status);

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8 min-h-[calc(100vh-5rem)] animate-fade-in">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="dark" className="bg-neutral-900 text-white border-none py-1 px-3 text-[9px] font-black uppercase rounded-full">
              Orden # {order.id.slice(0, 8).toUpperCase()}
            </Badge>
          </div>
          <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-neutral-900 leading-none">
            Seguimiento de Compra
          </h1>
        </div>

        <Button onClick={handleRefresh} variant="outline" size="sm" className="flex items-center gap-2 rounded-full border-neutral-200 py-2 px-4 shadow-none cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">Refrescar Estado</span>
        </Button>
      </div>

      {/* Modern Sleek Step Progress Indicator */}
      <Card className="border border-neutral-200 rounded-2xl p-6 md:p-8 bg-white shadow-xs">
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4">
          
          {/* Connector Line (Desktop) */}
          <div className="absolute left-0 md:left-[5%] md:top-[20px] right-0 md:right-[5%] h-full md:h-0.5 bg-neutral-100 -z-10 hidden md:block" />
          
          {statuses.map((step, idx) => {
            const isActive = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            const Icon = step.icon;

            return (
              <div key={step.value} className="flex md:flex-col items-center gap-4 md:text-center flex-1 relative">
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all z-10 ${
                    isCurrent
                      ? `${step.color} border-neutral-950 text-white scale-110 shadow-md`
                      : isActive
                      ? 'bg-neutral-900 border-neutral-900 text-white'
                      : 'bg-white border-neutral-200 text-neutral-400'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>

                {/* Text Details */}
                <div className="flex flex-col md:items-center">
                  <span className={`text-xs font-extrabold uppercase tracking-wider ${isActive ? 'text-neutral-900' : 'text-neutral-400'}`}>
                    {step.label}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-semibold mt-0.5">
                    {step.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Details summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Items summary */}
        <Card className="md:col-span-2 border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs">
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-neutral-900 mb-4 flex items-center gap-2 border-b border-neutral-100 pb-2">
            <ShoppingBag className="w-4.5 h-4.5" /> Productos Comprados
          </h3>
          <div className="flex flex-col gap-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center justify-between border-b border-neutral-50 pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 border border-neutral-200 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-50">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-neutral-900 truncate max-w-[200px]">
                      {item.product.name}
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-semibold uppercase">
                      Cant: {item.quantity} • ${item.price.toFixed(2)} c/u
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-neutral-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Info Box */}
        <Card className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs flex flex-col gap-4">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-2">
            Detalles de Entrega
          </h3>
          
          <div className="flex flex-col gap-3 text-xs font-medium text-neutral-600">
            <div>
              <span className="font-bold text-neutral-400 block uppercase text-[9px]">Método:</span>
              <span>Envío Standard</span>
            </div>
            <div>
              <span className="font-bold text-neutral-400 block uppercase text-[9px]">Comprador:</span>
              <span className="font-semibold text-neutral-900">{order.user?.name || 'Cliente'}</span>
            </div>
            <div>
              <span className="font-bold text-neutral-400 block uppercase text-[9px]">Monto Total:</span>
              <span className="font-extrabold text-neutral-900 text-sm">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
