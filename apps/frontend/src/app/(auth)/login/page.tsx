'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.login(formData);
      const { user, access_token } = response.data;
      setAuth(user, access_token);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <div className="text-center mb-6 lg:mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Intern Log System</h1>
        <p className="text-gray-600 mt-2">Masuk ke akun Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="nama@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="Masukkan password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Masuk
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Belum punya akun?{' '}
        <Link href="/register" className="text-blue-600 hover:underline font-medium">
          Daftar disini
        </Link>
      </p>
    </Card>
  );
}
