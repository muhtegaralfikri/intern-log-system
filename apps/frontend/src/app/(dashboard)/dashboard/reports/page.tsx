'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, Button } from '@/components/ui';
import { api, aiApi } from '@/lib/api';
import jsPDF from 'jspdf';

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
  const [downloading, setDownloading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const downloadPDF = () => {
    if (!selectedReport) return;
    
    setDownloading(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      let yPos = 20;

      // Title
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(selectedReport.title, margin, yPos);
      yPos += 10;

      // Period
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Periode: ${formatDate(selectedReport.periodStart)} - ${formatDate(selectedReport.periodEnd)}`, margin, yPos);
      yPos += 5;
      pdf.text(`Dibuat: ${formatDate(selectedReport.createdAt)}`, margin, yPos);
      yPos += 10;

      // Line
      pdf.setDrawColor(200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // Content
      pdf.setFontSize(11);
      const lines = pdf.splitTextToSize(selectedReport.content, maxWidth);
      
      for (const line of lines) {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, margin, yPos);
        yPos += 6;
      }

      // Footer
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(`Halaman ${i} dari ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
      }

      pdf.save(`${selectedReport.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

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
      weekly: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
      monthly: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
      daily: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    };
    return styles[type.toLowerCase()] || 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300';
  };

  return (
    <div>
      <Header title="Laporan" subtitle="Lihat dan kelola laporan aktivitas" />

      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600 dark:text-slate-400">
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
                    <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 dark:text-slate-400 mb-4">Belum ada laporan</p>
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
                        <h3 className="font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeBadge(report.type)}`}>
                          {report.type}
                        </span>
                        {report.isApproved && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                            Approved
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        Periode: {formatDate(report.periodStart)} - {formatDate(report.periodEnd)}
                      </p>
                      <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">
                        Dibuat: {formatDate(report.createdAt)}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detail Laporan</h3>
              {selectedReport && (
                <Button size="sm" variant="outline" onClick={downloadPDF} isLoading={downloading}>
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDF
                </Button>
              )}
            </div>
            {selectedReport ? (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <div className="border-b border-gray-200 dark:border-slate-600 pb-3 mb-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{selectedReport.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      Periode: {formatDate(selectedReport.periodStart)} - {formatDate(selectedReport.periodEnd)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                      Dibuat: {formatDate(selectedReport.createdAt)}
                    </p>
                  </div>

                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {selectedReport.content}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
                  <span className="text-sm text-gray-500 dark:text-slate-400">Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedReport.isApproved ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {selectedReport.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-slate-400 text-sm">Pilih laporan untuk melihat detail</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
