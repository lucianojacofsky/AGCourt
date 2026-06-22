"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) {
          onClose();
        } else {
          setError(result.error || 'Credenciales incorrectas');
        }
      } else {
        const result = await register(name, email, password);
        if (result.success) {
          onClose();
        } else {
          setError(result.error || 'Error al registrar usuario');
        }
      }
    } catch (err) {
      setError('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs"
      />

      {/* Modal Box */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-xl p-8 z-10"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-neutral-100 cursor-pointer transition-colors text-neutral-500 hover:text-neutral-900"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-display text-xl font-bold uppercase tracking-tight text-neutral-900 mb-6">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h3>

        {error && (
          <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-600 font-bold text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <Input
              label="Nombre Completo"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre Apellido"
            />
          )}

          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@ejemplo.com"
          />

          <Input
            label="Contraseña"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" variant="dark" className="w-full mt-2 rounded-full border-none transition-all py-3 shadow-none hover:bg-neutral-800" disabled={loading}>
            {loading ? 'Procesando...' : isLogin ? 'Ingresar' : 'Registrarse'}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
          >
            {isLogin ? '¿No tienes cuenta? Registrate' : '¿Ya tienes cuenta? Ingresa'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
