'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, Button, Input } from '@/components/ui';
import { usersApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    avatarUrl: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        department: user.department || '',
        avatarUrl: user.avatarUrl || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await usersApi.updateMe(formData);
      setUser({ ...user, ...response.data });
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage({ type: 'error', text: 'Gagal memperbarui profil' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Header title="Pengaturan" subtitle="Kelola profil dan preferensi akun Anda" />

      <div className="max-w-2xl">
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informasi Profil</h3>

          {message && (
            <div
              className={`p-3 rounded-lg mb-4 ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email"
              value={user?.email || ''}
              disabled
              className="bg-gray-100"
            />

            <Input
              id="name"
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              id="department"
              label="Departemen"
              placeholder="Contoh: Engineering, Design, Marketing"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />

            <Input
              id="avatarUrl"
              label="URL Avatar"
              placeholder="https://example.com/avatar.jpg"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
            />

            {formData.avatarUrl && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-slate-400">Preview:</span>
                <img
                  src={formData.avatarUrl}
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-slate-600"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.name);
                  }}
                />
              </div>
            )}

            <div className="pt-4">
              <Button type="submit" isLoading={saving}>
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </Card>

        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informasi Akun</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
              <span className="text-gray-600 dark:text-slate-400">Role</span>
              <span className="font-medium text-gray-900 dark:text-white capitalize">
                {user?.role?.toLowerCase() || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
              <span className="text-gray-600 dark:text-slate-400">User ID</span>
              <span className="font-mono text-sm text-gray-500 dark:text-slate-400">{user?.id || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 dark:text-slate-400">Bergabung Sejak</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '-'}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Keamanan</h3>
          <p className="text-gray-600 dark:text-slate-400 text-sm mb-4">
            Untuk keamanan akun, hubungi administrator jika ingin mengubah password.
          </p>
          <Button variant="outline" disabled>
            Ubah Password (Hubungi Admin)
          </Button>
        </Card>
      </div>
    </div>
  );
}
