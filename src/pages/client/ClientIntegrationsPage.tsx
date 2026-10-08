import React, { useState } from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import {
  Link2,
  CheckCircle2,
  RefreshCw,
  Shield,
  Layers,
  Key,
  ExternalLink,
} from 'lucide-react';

interface IntegrationItem {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultKey: string;
  useAgencyKey: boolean;
  status: 'Connected' | 'Pending' | 'Error';
  lastTested: string;
}

const DEFAULT_CLIENT_INTEGRATIONS: IntegrationItem[] = [
  { id: 'apollo', name: 'Apollo.io', category: 'B2B Leads', description: 'Contact enrichment and bulk email validation.', defaultKey: 'apl_live_••••••••••••98b2', useAgencyKey: true, status: 'Connected', lastTested: '2m ago' },
  { id: 'instantly', name: 'Instantly', category: 'Email Delivery', description: 'Dedicated sending pools and inbox warm-up.', defaultKey: 'ins_sec_••••••••••••33f1', useAgencyKey: true, status: 'Connected', lastTested: '14m ago' },
  { id: 'twilio', name: 'Twilio', category: 'SMS Messaging', description: 'A2P 10DLC registered conversational SMS dispatch.', defaultKey: 'twi_sid_••••••••••••881a', useAgencyKey: true, status: 'Connected', lastTested: '1h ago' },
  { id: 'openai', name: 'OpenAI API', category: 'AI Models', description: 'GPT-4o reasoning, structured output, and drafting.', defaultKey: 'sk-proj-••••••••••••09xk', useAgencyKey: true, status: 'Connected', lastTested: '5m ago' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM Sync', description: 'Deals, pipelines, and contact properties sync.', defaultKey: 'pat-na1-••••••••••••44m8', useAgencyKey: false, status: 'Connected', lastTested: '3h ago' },
  { id: 'gohighlevel', name: 'GoHighLevel', category: 'Multi-Location CRM', description: 'Sub-account webhook pipeline and contact sync.', defaultKey: 'ghl_key_••••••••••••55d0', useAgencyKey: false, status: 'Connected', lastTested: '12m ago' },
  { id: 'meta', name: 'Meta Lead Ads', category: 'Inbound Ads', description: 'Facebook and Instagram instant lead webhooks.', defaultKey: 'eaab_tok_••••••••••••77a3', useAgencyKey: false, status: 'Connected', lastTested: '40m ago' },
  { id: 'linkedin', name: 'LinkedIn Ads', category: 'B2B Targeting', description: 'Company page engagement and matched audiences.', defaultKey: 'li_oauth_••••••••••••12e9', useAgencyKey: false, status: 'Pending', lastTested: 'Never' },
  { id: 'slack', name: 'Slack Alerts', category: 'Notifications', description: 'High-intent lead alerts to private channels.', defaultKey: 'xoxb-app-••••••••••••66p4', useAgencyKey: true, status: 'Connected', lastTested: '6m ago' },
];

export const ClientIntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(DEFAULT_CLIENT_INTEGRATIONS);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleAgencyKey = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, useAgencyKey: !item.useAgencyKey } : item
      )
    );
    showToast('Updated API credential routing configuration');
  };

  const handleTestConnection = (item: IntegrationItem) => {
    setTestingId(item.id);
    setTimeout(() => {
      setTestingId(null);
      setIntegrations((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, status: 'Connected', lastTested: 'Just now' } : it
        )
      );
      showToast(`Connection test passed for ${item.name}`);
    }, 500);
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
              03 Workflows / Connections
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">Workspace Integrations</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Integrations & Service Connectors
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Connect third-party lead databases, email senders, SMS telephony, LLM endpoints, and CRM pipelines.
          </p>
        </div>

        <button
          onClick={() => showToast('Dispatched verification heartbeat to all 9 services')}
          className="flex items-center gap-2 rounded-[10px] border border-slate-200 bg-white/70 px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
          Test All Connectors
        </button>
      </div>

      {/* Agency Pool Inheritance Notice */}
      <div className="rounded-[14px] border border-blue-500/20 bg-blue-500/5 p-4 backdrop-blur-md flex items-start gap-3">
        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <h2 className="text-xs font-semibold text-blue-900 dark:text-blue-300">
            Agency Key Routing Protocol
          </h2>
          <p className="mt-0.5 text-xs text-blue-800/80 dark:text-blue-400/80 leading-relaxed">
            When &quot;Use agency keys&quot; is enabled, API calls are securely authenticated using the master agency credentials pool, with usage metered and billed to this tenant. Turn off to provide client-owned API tokens.
          </p>
        </div>
      </div>

      {/* 9 Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((item) => {
          const isTesting = testingId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-[14px] border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-[8px] border border-slate-200 bg-white p-1.5 shadow-xs dark:border-white/10 dark:bg-slate-800">
                      <Link2 className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </h2>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      item.status === 'Connected'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : item.status === 'Pending'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>

                {/* Key routing section */}
                <div className="mt-4 rounded-[10px] bg-slate-50 p-3 dark:bg-slate-800/40 border border-slate-200/50 dark:border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      Use agency keys
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleAgencyKey(item.id)}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        item.useAgencyKey ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          item.useAgencyKey ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {item.useAgencyKey ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 px-2 py-1 rounded-[6px]">
                      <Shield className="h-3 w-3 flex-shrink-0" />
                      <span>Inherited from agency pool</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        <Key className="h-3 w-3 text-slate-400" />
                        <span>{item.defaultKey}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Client-owned API token</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Test Connection */}
              <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono">
                  Tested: {item.lastTested}
                </span>

                <button
                  onClick={() => handleTestConnection(item)}
                  disabled={isTesting}
                  className="inline-flex items-center gap-1 rounded-[8px] border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <RefreshCw className={`h-3 w-3 ${isTesting ? 'animate-spin text-blue-500' : 'text-slate-400'}`} />
                  {isTesting ? 'Testing...' : 'Test'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
