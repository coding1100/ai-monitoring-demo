import React, { useState } from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import {
  FileText,
  Download,
  Calendar,
  Users,
  CheckCircle2,
  Mail,
  Plus,
  Trash2,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ClientReport } from '../../types';

const SAMPLE_CHART_DATA = [
  { day: 'Mon', leads: 48, replies: 9 },
  { day: 'Tue', leads: 62, replies: 14 },
  { day: 'Wed', leads: 55, replies: 8 },
  { day: 'Thu', leads: 74, replies: 18 },
  { day: 'Fri', leads: 85, replies: 22 },
  { day: 'Sat', leads: 32, replies: 5 },
  { day: 'Sun', leads: 28, replies: 3 },
];

export const ClientReportsPage: React.FC = () => {
  const { currentWorkspaceId, clientReports } = useDemoStore();

  const workspaceReports = clientReports.filter(
    (r) => r.workspaceId === currentWorkspaceId || r.workspaceId === 'halden'
  );

  const [selectedReport, setSelectedReport] = useState<ClientReport>(
    workspaceReports[0] || clientReports[0]
  );
  const [recipients, setRecipients] = useState<string[]>([
    'director@clientpractice.com',
    'growth@clientpractice.com',
  ]);
  const [newRecipient, setNewRecipient] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownloadPdf = () => {
    showToast(`Generating signed PDF export: ${selectedReport.title}.pdf`);
  };

  const handleScheduleReport = () => {
    showToast('Report dispatch schedule updated: Weekly Monday at 08:00 UTC');
  };

  const handleAddRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient.trim() || !newRecipient.includes('@')) return;
    if (recipients.includes(newRecipient.trim())) return;

    setRecipients([...recipients, newRecipient.trim()]);
    setNewRecipient('');
    showToast(`Added ${newRecipient.trim()} to digest distribution list`);
  };

  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r !== email));
    showToast(`Removed ${email} from distribution list`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-[10px] bg-blue-600 px-4 py-2.5 text-xs font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-[10px] border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-blue-600 dark:text-blue-400">
              05 Output / Reporting
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">Scheduled Insights</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Performance Reports
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Automated weekly summaries, monthly pipeline retrospectives, distribution recipients, and downloadable dossiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleScheduleReport}
            className="flex items-center gap-2 rounded-[10px] border border-slate-200 bg-white/70 px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            Schedule Report
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 rounded-[10px] bg-blue-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-blue-700"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Reports Catalog & Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Report List */}
        <div className="space-y-4 lg:col-span-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Generated Reports Archive ({workspaceReports.length})
          </h2>

          <div className="space-y-2.5">
            {workspaceReports.map((report) => {
              const isSelected = selectedReport.id === report.id;

              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`cursor-pointer rounded-[14px] border p-4 transition-all backdrop-blur-md ${
                    isSelected
                      ? 'border-blue-500/80 bg-blue-50/50 shadow-sm dark:border-blue-500/50 dark:bg-blue-950/30'
                      : 'border-slate-200/80 bg-white/70 hover:border-slate-300 dark:border-white/10 dark:bg-slate-900/70 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-[6px] px-2 py-0.5 font-mono text-[10px] font-semibold ${
                        report.type === 'Weekly'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                      }`}
                    >
                      {report.type}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {report.period}
                    </span>
                  </div>

                  <h3 className="mt-2 text-xs font-semibold text-slate-900 dark:text-white">
                    {report.title}
                  </h3>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/50 pt-2 dark:border-white/5">
                    <span>Leads: {report.leadsGenerated}</span>
                    <span>Replies: {report.repliesReceived}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">ROI: {report.roi}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recipients List Widget */}
          <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60 dark:border-white/10">
              <Mail className="h-4 w-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                Report Distribution List
              </h3>
            </div>

            <form onSubmit={handleAddRecipient} className="mt-3 flex gap-2">
              <input
                type="email"
                placeholder="colleague@domain.com"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                className="flex-1 rounded-[10px] border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="submit"
                className="rounded-[10px] bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-blue-700 shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </form>

            <div className="mt-3 divide-y divide-slate-200/50 dark:divide-white/5">
              {recipients.map((email, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 text-xs">
                  <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                    {email}
                  </span>
                  <button
                    onClick={() => handleRemoveRecipient(email)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Report Preview Pane */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
            {/* Dossier Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-200/60 dark:border-white/10">
              <div>
                <span className="font-mono text-[11px] text-slate-400">
                  Dossier Ref: {selectedReport.id.toUpperCase()} • {selectedReport.period}
                </span>
                <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                  {selectedReport.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Verified Data
                </span>
              </div>
            </div>

            {/* KPI Row inside report */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-[10px] bg-slate-50 p-3 dark:bg-slate-800/50">
                <div className="text-[11px] text-slate-500">Leads Generated</div>
                <div className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-white">
                  {selectedReport.leadsGenerated}
                </div>
              </div>

              <div className="rounded-[10px] bg-slate-50 p-3 dark:bg-slate-800/50">
                <div className="text-[11px] text-slate-500">Direct Inbound Replies</div>
                <div className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-white">
                  {selectedReport.repliesReceived}
                </div>
              </div>

              <div className="rounded-[10px] bg-slate-50 p-3 dark:bg-slate-800/50">
                <div className="text-[11px] text-slate-500">Total AI Spend</div>
                <div className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-white">
                  ${selectedReport.spend.toFixed(2)}
                </div>
              </div>

              <div className="rounded-[10px] bg-slate-50 p-3 dark:bg-slate-800/50">
                <div className="text-[11px] text-slate-500">Attributed ROI</div>
                <div className="mt-1 font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedReport.roi}
                </div>
              </div>
            </div>

            {/* Daily Inbound Trajectory Chart */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  Daily Lead Generation vs Direct Replies
                </h3>
                <span className="font-mono text-[11px] text-slate-400">Period Trajectory</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SAMPLE_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        fontSize: '11px',
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="leads" fill="#2563eb" name="Enriched Leads" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="replies" fill="#10b981" name="Direct Inbound Replies" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Qualitative Executive Summary */}
            <div className="mt-6 rounded-[10px] border border-slate-200/80 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-slate-800/30">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                Executive Synthesis
              </h4>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                During this period, multichannel sequences delivered an overall reply rate of{' '}
                {((selectedReport.repliesReceived / selectedReport.leadsGenerated) * 100).toFixed(1)}%.
                Verification via Apollo email validation maintained a 98.4% deliverability rate with zero spam complaint threshold excursions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
