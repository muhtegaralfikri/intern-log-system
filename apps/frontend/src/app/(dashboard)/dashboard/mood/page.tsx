'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, Button } from '@/components/ui';
import { moodApi } from '@/lib/api';

type MoodLevel = 'VERY_BAD' | 'BAD' | 'NEUTRAL' | 'GOOD' | 'VERY_GOOD';

interface MoodEntry {
  id: string;
  date: string;
  mood: MoodLevel;
  energy: number;
  notes?: string;
}

interface MoodAnalytics {
  totalEntries: number;
  avgMood: number;
  avgEnergy: number;
  moodDistribution: Record<string, number>;
  trend: { date: string; mood: number; energy: number }[];
}

const moodEmojis: Record<MoodLevel, string> = {
  VERY_BAD: '😢',
  BAD: '😔',
  NEUTRAL: '😐',
  GOOD: '😊',
  VERY_GOOD: '😄',
};

const moodLabels: Record<MoodLevel, string> = {
  VERY_BAD: 'Sangat Buruk',
  BAD: 'Buruk',
  NEUTRAL: 'Netral',
  GOOD: 'Baik',
  VERY_GOOD: 'Sangat Baik',
};

const energyLabels = ['', 'Sangat Rendah', 'Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi'];

export default function MoodPage() {
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [analytics, setAnalytics] = useState<MoodAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    mood: MoodLevel;
    energy: number;
    notes: string;
  }>({
    mood: 'NEUTRAL',
    energy: 3,
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [todayRes, historyRes, analyticsRes] = await Promise.all([
        moodApi.getToday(),
        moodApi.getHistory(),
        moodApi.getAnalytics(),
      ]);
      setTodayMood(todayRes.data);
      setHistory(historyRes.data?.data || []);
      setAnalytics(analyticsRes.data);
      if (todayRes.data) {
        setFormData({
          mood: todayRes.data.mood,
          energy: todayRes.data.energy,
          notes: todayRes.data.notes || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch mood data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await moodApi.create(formData);
      setShowForm(false);
      await fetchData();
    } catch (error) {
      console.error('Failed to save mood:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  if (loading) {
    return (
      <div>
        <Header title="Mood Tracker" subtitle="Pantau mood dan energi harian Anda" />
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <div className="animate-pulse space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Mood Tracker" subtitle="Pantau mood dan energi harian Anda" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-4xl mb-2">{todayMood ? moodEmojis[todayMood.mood] : '❓'}</p>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Mood Hari Ini</p>
            {todayMood && (
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{moodLabels[todayMood.mood]}</p>
            )}
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {analytics?.avgMood?.toFixed(1) || '-'}
            </p>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Rata-rata Mood</p>
            <p className="text-xs text-gray-500 dark:text-slate-500">(skala 1-5)</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {analytics?.avgEnergy?.toFixed(1) || '-'}
            </p>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Rata-rata Energi</p>
            <p className="text-xs text-gray-500 dark:text-slate-500">(skala 1-5)</p>
          </div>
        </Card>
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Batal' : todayMood ? 'Update Mood' : 'Catat Mood Hari Ini'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {todayMood ? 'Update Mood Hari Ini' : 'Catat Mood Hari Ini'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                Bagaimana mood Anda hari ini?
              </label>
              <div className="flex justify-center gap-4">
                {(Object.keys(moodEmojis) as MoodLevel[]).map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setFormData({ ...formData, mood })}
                    className={`p-4 rounded-xl transition-all ${
                      formData.mood === mood
                        ? 'bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500 scale-110'
                        : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <span className="text-4xl block">{moodEmojis[mood]}</span>
                    <span className="text-xs text-gray-600 dark:text-slate-400 mt-1 block">{moodLabels[mood]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                Level energi Anda: <span className="font-bold">{energyLabels[formData.energy]}</span>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.energy}
                onChange={(e) => setFormData({ ...formData, energy: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mt-1">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Catatan (opsional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Apa yang membuat Anda merasa seperti ini?"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" isLoading={submitting}>
                Simpan
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Batal
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Riwayat Mood</h3>
          {history.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
                >
                  <span className="text-3xl">{moodEmojis[entry.mood]}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-white">{moodLabels[entry.mood]}</span>
                      <span className="text-sm text-gray-500 dark:text-slate-400">{formatDate(entry.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-slate-400">Energi:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            className={`w-3 h-3 rounded-full mr-0.5 ${
                              i <= entry.energy ? 'bg-green-500' : 'bg-gray-300 dark:bg-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {entry.notes && (
                      <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">{entry.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-slate-400 text-center py-8">Belum ada riwayat mood</p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribusi Mood</h3>
          {analytics?.moodDistribution && Object.keys(analytics.moodDistribution).length > 0 ? (
            <div className="space-y-3">
              {(Object.keys(moodEmojis) as MoodLevel[]).map((mood) => {
                const count = analytics.moodDistribution[mood] || 0;
                const total = analytics.totalEntries || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={mood}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{moodEmojis[mood]}</span>
                        <span className="text-sm text-gray-700 dark:text-slate-300">{moodLabels[mood]}</span>
                      </span>
                      <span className="text-sm text-gray-600 dark:text-slate-400">{count}x ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-slate-400 text-center py-8">Belum ada data distribusi</p>
          )}
        </Card>
      </div>
    </div>
  );
}
