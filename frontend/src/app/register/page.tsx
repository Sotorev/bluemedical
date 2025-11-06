'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { registerSchema, RegisterFormData } from '@/utils/validators';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import Link from 'next/link';

export default function RegisterPage() {
  const { register: registerUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/tasks');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  if (authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-md mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-center text-gray-900">
              Crear Cuenta
            </h2>
            <p className="text-center text-gray-600 mt-2">
              Completa el formulario para registrarte
            </p>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                type="text"
                label="Nombre"
                placeholder="Juan Pérez"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                type="email"
                label="Email"
                placeholder="tu@email.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                type="password"
                label="Contraseña"
                placeholder="••••••••"
                helperText="Mínimo 6 caracteres"
                error={errors.password?.message}
                {...register('password')}
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Registrarse
              </Button>

              <div className="text-center text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Inicia sesión aquí
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

