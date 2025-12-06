'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, Button } from '@/components/ui';
import { badgesApi } from '@/lib/api';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export default function BadgesPage() {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [myBadges, setMyBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [allRes, myRes] = await Promise.all([
        badgesApi.getAll(),
        badgesApi.getMyBadges(),
      ]);
      setAllBadges(allRes.data);
      setMyBadges(myRes.data);
    } catch (error) {
      console.error('Failed to fetch badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkBadges = async () => {
    setChecking(true);
    try {
      const response = await badgesApi.checkBadges();
      if (response.data && response.data.length > 0) {
        setNewBadges(response.data);
        await fetchData();
      } else {
        setNewBadges([]);
      }
    } catch (error) {
      console.error('Failed to check badges:', error);
    } finally {
      setChecking(false);
    }
  };

  const earnedBadgeIds = myBadges.map((b) => b.id);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div>
        <Header title="Badges" subtitle="Kumpulkan badge dari pencapaian Anda" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <div className="animate-pulse text-center py-6">
                <div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3 mx-auto"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Badges" subtitle="Kumpulkan badge dari pencapaian Anda" />

      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600 dark:text-slate-400">
            <span className="font-semibold text-green-600 dark:text-green-400">{myBadges.length}</span> dari{' '}
            <span className="font-semibold">{allBadges.length}</span> badge diperoleh
          </p>
        </div>
        <Button onClick={checkBadges} isLoading={checking}>
          Cek Badge Baru
        </Button>
      </div>

      {newBadges.length > 0 && (
        <Card className="mb-6 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-semibold text-green-800 dark:text-green-300">Selamat! Anda mendapatkan badge baru:</p>
              <p className="text-green-700 dark:text-green-400">{newBadges.join(', ')}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Badge yang Diperoleh</h3>
        {myBadges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {myBadges.map((badge) => (
              <Card key={badge.id} className="text-center py-6 bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-900/20 dark:to-slate-800 border-yellow-200 dark:border-yellow-800">
                <span className="text-5xl block mb-3">{badge.icon}</span>
                <h4 className="font-semibold text-gray-900 dark:text-white">{badge.name}</h4>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{badge.description}</p>
                {badge.earnedAt && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    Diperoleh: {formatDate(badge.earnedAt)}
                  </p>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-gray-500 dark:text-slate-400 text-center py-8">
              Belum ada badge yang diperoleh. Terus beraktivitas untuk mendapatkan badge!
            </p>
          </Card>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Semua Badge</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allBadges.map((badge) => {
            const isEarned = earnedBadgeIds.includes(badge.id);
            return (
              <Card
                key={badge.id}
                className={`text-center py-6 ${isEarned ? 'bg-white dark:bg-slate-800' : 'bg-gray-100 dark:bg-slate-700/50 opacity-60'}`}
              >
                <span className={`text-5xl block mb-3 ${!isEarned && 'grayscale'}`}>
                  {badge.icon}
                </span>
                <h4 className="font-semibold text-gray-900 dark:text-white">{badge.name}</h4>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{badge.description}</p>
                {isEarned ? (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs rounded-full">
                    Diperoleh
                  </span>
                ) : (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-slate-400 text-xs rounded-full">
                    Belum diperoleh
                  </span>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
