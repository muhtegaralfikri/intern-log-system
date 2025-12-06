'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui';
import { skillsApi } from '@/lib/api';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  hours: number;
}

interface SkillProgress {
  skills: Skill[];
  totalHours: number;
  totalSkills: number;
}

interface SkillAnalytics {
  byCategory: Record<string, { hours: number; count: number }>;
  topSkills: { name: string; hours: number; level: number }[];
  radarData: { skill: string; value: number }[];
}

export default function SkillsPage() {
  const [progress, setProgress] = useState<SkillProgress | null>(null);
  const [analytics, setAnalytics] = useState<SkillAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, analyticsRes] = await Promise.all([
          skillsApi.getMyProgress(),
          skillsApi.getAnalytics(),
        ]);
        setProgress(progressRes.data);
        setAnalytics(analyticsRes.data);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getLevelColor = (level: number) => {
    if (level >= 80) return 'bg-green-500';
    if (level >= 60) return 'bg-blue-500';
    if (level >= 40) return 'bg-yellow-500';
    if (level >= 20) return 'bg-orange-500';
    return 'bg-gray-400';
  };

  const getLevelLabel = (level: number) => {
    if (level >= 80) return 'Expert';
    if (level >= 60) return 'Advanced';
    if (level >= 40) return 'Intermediate';
    if (level >= 20) return 'Beginner';
    return 'Novice';
  };

  if (loading) {
    return (
      <div>
        <Header title="Skills" subtitle="Pantau perkembangan skill Anda" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="animate-pulse space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Skills" subtitle="Pantau perkembangan skill Anda" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{progress?.totalSkills || 0}</p>
            <p className="text-gray-600 text-sm">Total Skills</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{progress?.totalHours || 0}</p>
            <p className="text-gray-600 text-sm">Total Jam</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              {analytics?.topSkills?.[0]?.name || '-'}
            </p>
            <p className="text-gray-600 text-sm">Top Skill</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Progress</h3>
          {progress?.skills && progress.skills.length > 0 ? (
            <div className="space-y-4">
              {progress.skills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({skill.category})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-700">{skill.level}%</span>
                      <span className="text-xs text-gray-500 ml-2">{skill.hours}h</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${getLevelColor(skill.level)}`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{getLevelLabel(skill.level)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Belum ada data skill. Mulai catat aktivitas dengan tag skill!
            </p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skills</h3>
          {analytics?.topSkills && analytics.topSkills.length > 0 ? (
            <div className="space-y-3">
              {analytics.topSkills.map((skill, index) => (
                <div
                  key={skill.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{skill.name}</p>
                      <p className="text-xs text-gray-500">Level: {skill.level}%</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{skill.hours} jam</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Belum ada data top skills</p>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills by Category</h3>
          {analytics?.byCategory && Object.keys(analytics.byCategory).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analytics.byCategory).map(([category, data]) => (
                <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900">{category}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{data.count}</p>
                  <p className="text-xs text-gray-500">skills</p>
                  <p className="text-sm text-gray-600 mt-1">{data.hours} jam</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Belum ada data kategori</p>
          )}
        </Card>
      </div>
    </div>
  );
}
