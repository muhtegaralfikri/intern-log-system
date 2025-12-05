'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, Button, Input } from '@/components/ui';
import { api } from '@/lib/api';

interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  date: string;
  createdAt: string;
}

const categories = [
  'Development',
  'Design',
  'Meeting',
  'Research',
  'Documentation',
  'Learning',
  'Testing',
  'Other',
];

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Development',
    duration: 60,
    date: new Date().toISOString().split('T')[0],
  });

  const fetchActivities = async () => {
    try {
      const response = await api.get('/activities');
      setActivities(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/activities', {
        ...formData,
        date: new Date(formData.date).toISOString(),
      });
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'Development',
        duration: 60,
        date: new Date().toISOString().split('T')[0],
      });
      fetchActivities();
    } catch (error) {
      console.error('Failed to create activity:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} menit`;
    if (mins === 0) return `${hours} jam`;
    return `${hours} jam ${mins} menit`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Development: 'bg-blue-100 text-blue-700',
      Design: 'bg-purple-100 text-purple-700',
      Meeting: 'bg-yellow-100 text-yellow-700',
      Research: 'bg-green-100 text-green-700',
      Documentation: 'bg-gray-100 text-gray-700',
      Learning: 'bg-indigo-100 text-indigo-700',
      Testing: 'bg-orange-100 text-orange-700',
      Other: 'bg-pink-100 text-pink-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <Header title="Aktivitas" subtitle="Catat dan kelola aktivitas harian Anda" />

      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">
            Total: <span className="font-semibold">{activities.length}</span> aktivitas
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Batal' : '+ Tambah Aktivitas'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tambah Aktivitas Baru</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="title"
              label="Judul Aktivitas"
              placeholder="Contoh: Mengembangkan fitur login"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Jelaskan detail aktivitas yang dilakukan..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (menit)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" isLoading={submitting}>Simpan</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="animate-pulse space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 mb-4">Belum ada aktivitas tercatat</p>
            <Button onClick={() => setShowForm(true)}>Tambah Aktivitas Pertama</Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {activities.map((activity) => (
            <Card key={activity.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
                      {activity.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(activity.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDuration(activity.duration)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
