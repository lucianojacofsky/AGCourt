"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CreditCard, ShoppingBag, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function CheckoutPage() {
  const { user, login, register } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();

  // Shipping details state
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');

  // Authentication inline state (if user is not logged in)
  const [isLogin, setIsLogin] = useState(true);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Payment simulation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if cart is empty and we aren't in a processing state
  useEffect(() => {
    if (cartItems.length === 0 && !isProcessing && !paymentSuccess) {
      router.push('/');
    }
  }, [cartItems, isProcessing, paymentSuccess, router]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (isLogin) {
        const result = await login(authEmail, authPassword);
        if (!result.success) setAuthError(result.error || 'Credenciales inválidas');
      } else {
        const result = await register(authName, authEmail, authPassword);
        if (!result.success) setAuthError(result.error || 'Error al registrarse');
      }
    } catch (err) {
      setAuthError('Error de red');
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!address || !city || !phone) {
      setErrorMessage('Por favor, completa los datos de envío.');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);

    // 2-second simulation
    setTimeout(async () => {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
            })),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setPaymentSuccess(true);
          clearCart();
          setTimeout(() => {
            router.push(`/order-tracking/${data.id}`);
          }, 1500);
        } else {
          setErrorMessage(data.error || 'Error al procesar el pedido');
          setIsProcessing(false);
        }
      } catch (err) {
        setErrorMessage('Error al conectar con el servidor');
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8 relative min-h-[calc(100vh-5rem)] animate-fade-in">
      
      {/* Payment Simulation Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 text-white"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full bg-white text-neutral-900 border border-neutral-200 rounded-2xl p-8 shadow-xl text-center flex flex-col items-center gap-6"
            >
              {paymentSuccess ? (
                <>
                  <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="font-display text-xl font-bold uppercase tracking-tight text-neutral-900">
                    ¡Pago Aprobado!
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium">
                    Tu pago fue procesado correctamente. Redirigiéndote para realizar el seguimiento de tu pedido...
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center w-14 h-14 bg-neutral-100 rounded-full border border-neutral-200">
                    <Loader2 className="w-6 h-6 text-neutral-900 animate-spin" />
                  </div>
                  <h2 className="font-display text-base font-bold uppercase tracking-wider text-neutral-900">
                    Procesando Pago
                  </h2>
                  <p className="text-xs text-neutral-500 font-semibold">
                    Conectando con la pasarela de pagos...
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="font-display text-3xl font-black uppercase tracking-tight text-neutral-900 leading-none">
        Finalizar Compra
      </h1>

      {errorMessage && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-600 font-bold text-xs rounded-xl">
          {errorMessage}
        </div>
      )}

      {/* Grid: Forms vs Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Forms column (Auth or Shipping) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {!user ? (
            /* Auth Form */
            <Card className="border border-neutral-200 rounded-2xl p-8 bg-white shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-bold uppercase tracking-tight text-neutral-900">
                  {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h3>
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setAuthError('');
                  }}
                  className="text-xs font-bold uppercase text-orange-600 hover:underline cursor-pointer"
                >
                  {isLogin ? 'Crear Cuenta' : 'Tengo Cuenta'}
                </button>
              </div>

              {authError && (
                <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-600 font-bold text-xs rounded-lg">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                {!isLogin && (
                  <Input
                    label="Nombre Completo"
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Nombre Apellido"
                  />
                )}

                <Input
                  label="Email"
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                />

                <Input
                  label="Contraseña"
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                />

                <Button type="submit" variant="dark" disabled={authLoading} className="mt-2 rounded-full border-none transition-all py-3 shadow-none hover:bg-neutral-800">
                  {authLoading ? 'Procesando...' : isLogin ? 'Ingresar y Continuar' : 'Registrarse y Continuar'}
                </Button>
              </form>
            </Card>
          ) : (
            /* Shipping Form */
            <Card className="border border-neutral-200 rounded-2xl p-8 bg-white shadow-xs">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-neutral-900 mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5" /> Datos de Envío
              </h3>

              <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Dirección de Envío"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle, número, depto..."
                  />
                  <Input
                    label="Ciudad / Provincia"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ej. CABA"
                  />
                </div>

                <Input
                  label="Número de Teléfono"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Código de área y número"
                />

                <div className="p-4 border border-neutral-200 bg-neutral-50 rounded-lg flex items-start gap-3 mt-2">
                  <input
                    type="checkbox"
                    id="mock-pay-check"
                    required
                    defaultChecked
                    className="w-4 h-4 rounded text-neutral-900 border-neutral-300 bg-white mt-1 outline-none cursor-pointer"
                  />
                  <label htmlFor="mock-pay-check" className="text-xs text-neutral-500 font-semibold leading-normal cursor-pointer select-none">
                    Confirmar datos de envío y proceder con la simulación segura de pago.
                  </label>
                </div>

                <Button type="submit" variant="secondary" className="w-full mt-4 rounded-full border-none py-3.5 shadow-none bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Realizar Pago</span>
                </Button>
              </form>
            </Card>
          )}
        </div>

        {/* Order Summary column */}
        <div className="flex flex-col gap-6">
          <Card className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs flex flex-col gap-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-2">
              <ShoppingBag className="w-4.5 h-4.5" /> Resumen de Compra
            </h3>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[220px] no-scrollbar">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between items-start gap-2 border-b border-neutral-50 pb-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-neutral-900 uppercase truncate max-w-[160px]">
                      {product.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-semibold uppercase">
                      Talle 10 • Cant: {quantity}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-neutral-900">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-100 pt-3 flex justify-between items-center mt-2">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-neutral-400">
                Total
              </span>
              <span className="font-display text-lg font-extrabold text-neutral-900">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
