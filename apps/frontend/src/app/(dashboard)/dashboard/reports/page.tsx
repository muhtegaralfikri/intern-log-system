'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, Button } from '@/components/ui';
import { api, aiApi } from '@/lib/api';

interface Report {
  id: string;
  title: string;
  content: string;
  aiSummary?: string;
  type: string;
  periodStart: string;
  periodEnd: string;
  isApproved: boolean;
  createdAt: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const generateWeeklyReport = async () => {
    setGenerating(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      await aiApi.weeklyReport(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      fetchReports();
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      weekly: 'bg-blue-100 text-blue-700',
      monthly: 'bg-purple-100 text-purple-700',
      daily: 'bg-green-100 text-green-700',
    };
    return styles[type.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <Header title="Laporan" subtitle="Lihat dan kelola laporan aktivitas" />

      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">
            Total: <span className="font-semibold">{reports.length}</span> laporan
          </p>
        </div>
        <Button onClick={generateWeeklyReport} isLoading={generating}>
          Generate Laporan Mingguan (AI)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <div className="animate-pulse space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 mb-4">Belum ada laporan</p>
                <Button onClick={generateWeeklyReport} isLoading={generating}>
                  Generate Laporan Pertama
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card
                  key={report.id}
                  className={`cursor-pointer transition-shadow hover:shadow-md ${
                    selectedReport?.id === report.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeBadge(report.type)}`}>
                          {report.type}
                        </span>
                        {report.isApproved && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Approved
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Periode: {formatDate(report.periodStart)} - {formatDate(report.periodEnd)}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Dibuat: {formatDate(report.createdAt)}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Laporan</h3>
            {selectedReport ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedReport.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(selectedReport.periodStart)} - {formatDate(selectedReport.periodEnd)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Konten:</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedReport.content}</p>
                </div>

                {selectedReport.aiSummary && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-700 mb-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI Summary
                    </p>
                    <p className="text-sm text-blue-600">{selectedReport.aiSummary}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedReport.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedReport.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Pilih laporan untuk melihat detail</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
