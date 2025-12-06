'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, Button, Input } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await api.patch('/users/profile', formData);
      setAuth(response.data, useAuthStore.getState().token!);
      setEditing(false);
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui' });
    } catch {
      setMessage({ type: 'error', text: 'Gagal memperbarui profil' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Profil" subtitle="Kelola informasi profil Anda" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Informasi Profil</h3>
              {!editing && (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  Edit Profil
                </Button>
              )}
            </div>

            {message && (
              <div className={`p-3 rounded-lg mb-4 text-sm ${
                message.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="name"
                  label="Nama Lengkap"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <Input
                  id="email"
                  label="Email"
                  value={user?.email || ''}
                  disabled
                />

                <Input
                  id="department"
                  label="Department"
                  placeholder="Contoh: Engineering"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />

                <div className="flex gap-3 pt-2">
                  <Button type="submit" isLoading={loading}>Simpan</Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setEditing(false);
                    setFormData({ name: user?.name || '', department: user?.department || '' });
                  }}>
                    Batal
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-slate-700">
                  <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <span className="text-3xl font-semibold text-blue-600 dark:text-blue-400">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h4>
                    <p className="text-gray-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Role</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user?.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Department</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user?.department || '-'}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Keamanan</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Password</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Terakhir diubah: -</p>
                </div>
                <Button variant="outline" size="sm">Ubah Password</Button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Tingkatkan keamanan akun</p>
                </div>
                <Button variant="outline" size="sm" disabled>Coming Soon</Button>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistik</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Total Aktivitas</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">0</p>
                <p className="text-sm text-green-700 dark:text-green-300">Hari Hadir</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">Laporan Dibuat</p>
              </div>
            </div>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Badges</h3>
            <div className="text-center py-6">
              <svg className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <p className="text-sm text-gray-500 dark:text-slate-400">Belum ada badge</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
