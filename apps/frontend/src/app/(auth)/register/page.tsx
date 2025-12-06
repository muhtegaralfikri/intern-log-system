'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    
    // Character variety
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    
    // Determine label and color
    if (strength < 40) return { strength, label: 'Lemah', color: 'bg-red-500' };
    if (strength < 60) return { strength, label: 'Cukup', color: 'bg-yellow-500' };
    if (strength < 80) return { strength, label: 'Baik', color: 'bg-blue-500' };
    return { strength, label: 'Kuat', color: 'bg-green-500' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password minimal 8 karakter');
      setIsLoading(false);
      return;
    }

    // Check for combination of letters and numbers
    const hasLetter = /[a-zA-Z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    
    if (!hasLetter || !hasNumber) {
      setError('Password harus mengandung kombinasi huruf dan angka');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      const { user, access_token } = response.data;
      setAuth(user, access_token);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Registrasi gagal. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <div className="text-center mb-6 lg:mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daftar Akun</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-2">Buat akun baru untuk memulai</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <Input
          id="name"
          type="text"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap Anda"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="Masukkan email Anda"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <div className="space-y-2">
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Buat kata sandi (minimal 8 karakter)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          
          {formData.password && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-slate-400">Kekuatan Password:</span>
                <span className={`font-medium ${
                  getPasswordStrength(formData.password).label === 'Lemah' ? 'text-red-600 dark:text-red-400' :
                  getPasswordStrength(formData.password).label === 'Cukup' ? 'text-yellow-600 dark:text-yellow-400' :
                  getPasswordStrength(formData.password).label === 'Baik' ? 'text-blue-600 dark:text-blue-400' :
                  'text-green-600 dark:text-green-400'
                }`}>
                  {getPasswordStrength(formData.password).label}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getPasswordStrength(formData.password).color} transition-all duration-300`}
                  style={{ width: `${getPasswordStrength(formData.password).strength}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Gunakan minimal 8 karakter dengan kombinasi huruf dan angka
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Konfirmasi Password"
            placeholder="Ulangi kata sandi Anda"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-[38px] text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Daftar
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 dark:text-slate-400 mt-6">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
          Masuk disini
        </Link>
      </p>
    </Card>
  );
}
