import React, { useState } from 'react';
import {
  Magnet,
  FileText,
  Code2,
  Upload,
  AlertCircle,
  CheckCircle2,
  Share2,
  Copy,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { fakeDelay } from '../../utils/seededRandom';

export const B2cCapturePage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const leads = useDemoStore((state) => state.leads).filter(
    (l) => l.workspace_id === currentWorkspaceId && (l.source === 'web_form' || l.source === 'meta_ad')
  );

  const [activeTab, setActiveTab] = useState<'pages' | 'forms' | 'feed' | 'import' | 'meta' | 'social'>('pages');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const landingPages = [
    {
      id: 'lp_01',
      title: 'Spring Aesthetics Treatment Booking',
      slug: '/offer/spring-refresh',
      utm: 'utm_source=meta_ad&utm_campaign=spring_2026',
      consentText: 'I consent to receive conversational SMS appointment confirmations & marketing notices. Reply STOP to cancel.',
      fields: ['Full Name', 'Mobile Number', 'Email', 'Preferred Treatment', 'Preferred Day'],
      conversions: 84,
      cr: '9.4%',
    },
    {
      id: 'lp_02',
      title: 'New Patient Dental Exam Consultation',
      slug: '/patient/new-consult',
      utm: 'utm_source=google_search&utm_medium=cpc',
      consentText: 'I agree to terms of service and HIPAA compliant appointment communications.',
      fields: ['Patient Name', 'Phone', 'Email', 'Insurance Provider', 'Reason for Visit'],
      conversions: 142,
      cr: '12.8%',
    },
  ];

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(`https://api.platform.demo/v1/webhooks/ingest/${currentWorkspaceId}`);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSimulateCsvUpload = async () => {
    await fakeDelay(700);
    setImportStatus('Parsed 120 rows. Dedupe result: 114 valid net-new records inserted with verified opt-in consent.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">03 WORKFLOWS</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">B2C Capture</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            B2C Capture & Inbound Gateways
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Capture patient and consumer inquiries across embeddable forms, Meta Lead Ads, and CSV list imports.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="b2c_inquiries" count={leads.length} />
          <DiagramChip reference="03 Workflows / B2C capture / Meta Ads" type="built" />
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 glass-panel p-2">
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
            activeTab === 'pages' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
          }`}
        >
          Landing Pages ({landingPages.length})
        </button>
        <button
          onClick={() => setActiveTab('forms')}
          className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
            activeTab === 'forms' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
          }`}
        >
          Forms & Embeds
        </button>
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
            activeTab === 'feed' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
          }`}
        >
          Website Inquiry Feed ({leads.length})
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
            activeTab === 'import' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
          }`}
        >
          List Import
        </button>
        <button
          onClick={() => setActiveTab('meta')}
          className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
            activeTab === 'meta' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
          }`}
        >
          Meta Lead Ads
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
            activeTab === 'social' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
          }`}
        >
          Social Inbox
        </button>
      </div>

      {/* Tab 1: Landing Pages Preview */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {landingPages.map((lp) => (
            <div key={lp.id} className="glass-dense p-5 rounded-panel border border-slate-200/60 dark:border-slate-800/60 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{lp.title}</h3>
                  <div className="text-xs font-mono text-accent mt-0.5">{lp.slug}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{lp.conversions} Leads</div>
                  <div className="text-[10px] text-emerald-600 font-mono">CR: {lp.cr}</div>
                </div>
              </div>

              {/* Form fields mockup */}
              <div className="space-y-2 p-3.5 rounded-control bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/40 text-xs">
                <div className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] mb-1">
                  Active Form Fields:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {lp.fields.map((f, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-control bg-slate-100/30 dark:bg-slate-900/30 text-[11px] space-y-1">
                <div className="font-mono text-slate-500">Consent Language:</div>
                <p className="text-slate-600 dark:text-slate-400 italic">"{lp.consentText}"</p>
                <div className="text-[10px] font-mono text-slate-400 mt-1">UTM: {lp.utm}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Forms List & Embed Codes */}
      {activeTab === 'forms' && (
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Webhook Endpoint & HTML Embed Snippet
          </h3>
          <p className="text-xs text-slate-500">
            Inbound submissions post directly into the n8n orchestrator with automatic phone verification and deduplication.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Public Webhook Ingest URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://api.platform.demo/v1/webhooks/ingest/${currentWorkspaceId}`}
                  className="w-full px-3 py-2 text-xs font-mono rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800/80 text-slate-800 dark:text-slate-200"
                />
                <button
                  onClick={handleCopyWebhook}
                  className="px-3 py-2 text-xs font-medium rounded-control bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 inline-flex items-center gap-1.5 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedUrl ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Embed HTML Snippet
              </label>
              <pre className="p-3 text-[11px] font-mono rounded-control bg-slate-900 text-slate-100 overflow-x-auto">
{`<form action="https://api.platform.demo/v1/webhooks/ingest/${currentWorkspaceId}" method="POST">
  <input type="text" name="fullName" placeholder="Your Name" required />
  <input type="tel" name="phone" placeholder="Phone Number" required />
  <input type="email" name="email" placeholder="Email Address" required />
  <input type="hidden" name="workspace_id" value="${currentWorkspaceId}" />
  <input type="checkbox" name="sms_consent" required /> I consent to SMS reminders
  <button type="submit">Submit Request</button>
</form>`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Website Inquiry Feed */}
      {activeTab === 'feed' && (
        <div className="glass-dense p-5 rounded-panel space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              Live Inbound Inquiries ({leads.length} Records)
            </h3>
            <span className="text-[10px] font-mono text-emerald-600">ZeroBounce Verified</span>
          </div>

          <div className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
            {leads.slice(0, 6).map((lead) => (
              <div key={lead.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{lead.fullName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{lead.phone} | {lead.email}</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600">
                    {lead.source}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">{lead.updatedAt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: First-Party List Import */}
      {activeTab === 'import' && (
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            First-Party CSV Ingest & Column Mapper
          </h3>
          <p className="text-xs text-slate-500">
            Upload offline customer lists with mandatory opt-in consent proof. Deduplication runs automatically against the global suppression registry.
          </p>

          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-control p-8 text-center space-y-3">
            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Drag and drop prospect CSV or click to browse (Demo mode simulates file parsing)
            </div>
            <ActionButton
              rbacAction="create_plan"
              variant="secondary"
              onAsyncClick={handleSimulateCsvUpload}
            >
              <span>Simulate Upload customer_export_q1.csv</span>
            </ActionButton>
          </div>

          {importStatus && (
            <div className="p-3 rounded-control bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Meta Lead Ads Card (Pending Review) */}
      {activeTab === 'meta' && (
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-control bg-blue-500/10 text-blue-600">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Meta Lead Ads Integration
                </h3>
                <div className="text-xs text-slate-500">Facebook & Instagram Instant Forms</div>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold border border-amber-500/30">
              Pending App Review
            </span>
          </div>

          <div className="p-4 rounded-control bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Meta Graph API Review Status</span>
            </div>
            <p>
              The direct Graph API leadgen webhook is awaiting standard Meta App Review verification. While pending, the webhook fallback listener is capturing inbound leads via Zapier/Make relay without data loss.
            </p>
          </div>

          <div className="p-3 rounded-control border border-slate-200/60 dark:border-slate-800/60 text-xs space-y-1 font-mono">
            <div className="text-slate-500">Fallback Webhook Receiver:</div>
            <div className="text-accent">https://api.platform.demo/v1/meta-fallback/{currentWorkspaceId}</div>
          </div>
        </div>
      )}

      {/* Tab 6: Inbound Social Inbox */}
      {activeTab === 'social' && (
        <div className="glass-dense p-5 rounded-panel space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              Inbound Social Comments & DMs
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Instagram & Facebook</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-control border border-slate-200/60 dark:border-slate-800/60 text-xs space-y-1">
              <div className="flex items-center justify-between font-medium">
                <span className="text-slate-900 dark:text-slate-100">@dr.mariah_aesthetics (Instagram DM)</span>
                <span className="text-[10px] font-mono text-slate-400">1h ago</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                "Hi, saw your post on medical director protocols. Do you have availability for an informational call next week?"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
