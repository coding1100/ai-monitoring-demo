import React, { useState } from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Copy,
  CheckCircle2,
  Send,
  ExternalLink,
  Globe,
  Sliders,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const ClientWebsiteIntegrationPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentWorkspaceId,
    websiteForms,
    submitWebsiteInquiry,
  } = useDemoStore();

  const [testName, setTestName] = useState('Charlotte Hayes');
  const [testEmail, setTestEmail] = useState('charlotte.hayes@example.com');
  const [testPhone, setTestPhone] = useState('+1 (555) 234-5678');
  const [testCompany, setTestCompany] = useState('Hayes Aesthetic Studio');
  const [testMessage, setTestMessage] = useState('Looking to schedule a consultation for multi-location marketing onboarding.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadCreated, setLeadCreated] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const embedScript = `<!-- Platform Dynamic Booking & Form Embed -->
<script
  src="https://cdn.platform.internal/v1/embed.js"
  data-workspace-id="${currentWorkspaceId}"
  data-theme="auto"
  async
></script>`;

  const trackingScript = `<!-- Platform Attribution & Session Tracker -->
<script>
  window.platformTracker = window.platformTracker || [];
  window.platformTracker.push({
    event: 'init',
    workspaceId: '${currentWorkspaceId}',
    autoTrackForms: true,
    respectDnt: true
  });
</script>
<script src="https://cdn.platform.internal/v1/telemetry.js" async></script>`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard`);
  };

  const handleTestInboundLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitWebsiteInquiry({
      fullName: testName,
      email: testEmail,
      phone: testPhone,
      company: testCompany,
      message: testMessage,
    });
    setIsSubmitting(false);
    setLeadCreated(true);
    showToast(`Inbound test lead registered for ${testName}! Inserted into B2C capture.`);
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
              03 Workflows / Webhook
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">Website Lead Capture</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Website Integration & Inbound Forms
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Embed interactive booking forms on your website, deploy session attribution trackers, and ingest verified leads into B2C Capture.
          </p>
        </div>

        <button
          onClick={() => navigate('/workflows/b2c-capture')}
          className="flex items-center gap-2 rounded-[10px] border border-slate-200 bg-white/70 px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <span>Open B2C Capture</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Code Snippets Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Embed Snippet */}
        <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-500" />
                <h2 className="text-xs font-semibold text-slate-900 dark:text-white">
                  Client Website Embed Snippet
                </h2>
              </div>
              <button
                onClick={() => copyToClipboard(embedScript, 'embed script')}
                className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <Copy className="h-3 w-3" />
                Copy Snippet
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Paste this tag into your website template header or tag manager to render the consultation widget.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-[10px] bg-slate-900 p-3 font-mono text-[11px] text-slate-200">
              <code>{embedScript}</code>
            </pre>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 font-mono">
            Host payload: 4.8 KB gzipped • Async non-blocking
          </div>
        </div>

        {/* Tracking Snippet */}
        <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-500" />
                <h2 className="text-xs font-semibold text-slate-900 dark:text-white">
                  Visitor Attribution & Session Tracker
                </h2>
              </div>
              <button
                onClick={() => copyToClipboard(trackingScript, 'attribution snippet')}
                className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <Copy className="h-3 w-3" />
                Copy Snippet
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Captures UTM campaign parameters, referrer sources, and first-party conversion cookies.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-[10px] bg-slate-900 p-3 font-mono text-[11px] text-slate-200">
              <code>{trackingScript}</code>
            </pre>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 font-mono">
            GDPR / CCPA compliant • Cookie-less first-party ping
          </div>
        </div>
      </div>

      {/* Connected Forms List */}
      <div className="rounded-[14px] border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70 overflow-hidden">
        <div className="p-4 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Connected Forms ({websiteForms.length})
          </h2>
          <span className="text-xs text-slate-500">Live webhook ingest endpoints</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Form Name</th>
                <th className="px-4 py-3">Webhook Endpoint URL</th>
                <th className="px-4 py-3 text-right">Submissions</th>
                <th className="px-4 py-3 text-right">Conversion Rate</th>
                <th className="px-4 py-3">Last Submission</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
              {websiteForms.map((form) => (
                <tr key={form.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    {form.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-blue-600 dark:text-blue-400">
                    {form.endpointUrl}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                    {form.submissionsCount}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {form.conversionRate}
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                    {form.lastSubmission}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {form.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Preview & Test Inbound Lead Form */}
      <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-200/60 dark:border-white/10">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              Live Widget Preview & Test Lead Pipeline
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Submit a simulated inquiry to test form validation, automated lead scoring, and instant routing to B2C Capture.
            </p>
          </div>

          {leadCreated && (
            <button
              onClick={() => navigate('/workflows/b2c-capture')}
              className="flex items-center gap-1.5 rounded-[10px] bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700"
            >
              <span>View in B2C Capture</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <form onSubmit={handleTestInboundLead} className="mt-5 max-w-2xl space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300">
                Prospect Full Name
              </label>
              <input
                type="text"
                required
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                required
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300">
                Company / Practice Name
              </label>
              <input
                type="text"
                required
                value={testCompany}
                onChange={(e) => setTestCompany(e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300">
              Inquiry / Consultation Notes
            </label>
            <textarea
              rows={3}
              required
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="mt-1 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-[10px] bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className={`h-3.5 w-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
              {isSubmitting ? 'Simulating Webhook (500ms)...' : 'Test Inbound Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
