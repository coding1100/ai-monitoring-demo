import React, { useState } from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Download,
  Shield,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';
import { PlanTier } from '../../types';

export const ClientPlanUsagePage: React.FC = () => {
  const {
    currentWorkspaceId,
    clientWorkspaces,
    planDefinitions,
    agencyInvoices,
    updateClientWorkspacePlan,
    toggleWorkspaceStatus,
  } = useDemoStore();

  const currentWorkspace =
    clientWorkspaces.find((w) => w.id === currentWorkspaceId) ||
    clientWorkspaces[0];

  const currentPlan =
    planDefinitions.find((p) => p.name === currentWorkspace.plan) ||
    planDefinitions[1];

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectPlan = (planTier: PlanTier) => {
    updateClientWorkspacePlan(currentWorkspace.id, planTier);
    setShowUpgradeModal(false);
    showToast(`Updated workspace tier to ${planTier} plan`);
  };

  const handleConfirmCancel = () => {
    toggleWorkspaceStatus(currentWorkspace.id, 'paused');
    setShowCancelDialog(false);
    showToast('Subscription cancelled. Workspace status changed to paused.');
  };

  const invoices = agencyInvoices.filter(
    (inv) => inv.workspaceId === currentWorkspace.id || inv.workspaceId === 'halden'
  );

  const leadsPercent = Math.min(100, Math.round((currentWorkspace.leadsThisMonth / currentPlan.leads) * 100));
  const emailsPercent = Math.min(100, Math.round((currentWorkspace.emailsSent / currentPlan.emails) * 100));
  const smsPercent = Math.min(100, Math.round((currentWorkspace.smsSent / currentPlan.sms) * 100));
  const postsPercent = Math.min(100, Math.round((currentWorkspace.postsPublished / currentPlan.posts) * 100));

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
              05 Output / Billing
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">Subscription & Meters</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Plan & Usage Meters
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor current monthly consumption against tier thresholds, manage payment details, and review invoice records.
          </p>
        </div>

        <button
          onClick={() => setShowUpgradeModal(true)}
          className="flex items-center gap-2 rounded-[10px] bg-blue-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-blue-700"
        >
          <Sparkles className="h-4 w-4" />
          Change Subscription Plan
        </button>
      </div>

      {/* Current Plan Overview Card */}
      <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200/60 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-[8px] bg-blue-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                {currentPlan.name} Tier
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  currentWorkspace.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}
              >
                {currentWorkspace.status === 'active' ? 'Active Subscription' : 'Paused Subscription'}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">
                ${currentPlan.price}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ month billed via Stripe</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="rounded-[10px] border border-blue-500/30 bg-blue-50 px-3.5 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-950/40 dark:text-blue-400"
            >
              Upgrade Tier
            </button>
          </div>
        </div>

        {/* 4 Usage Meters */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Leads meter */}
          <div className="rounded-[10px] bg-slate-50/70 p-4 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Verified Leads</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{leadsPercent}%</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1 font-mono">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {currentWorkspace.leadsThisMonth.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">/ {currentPlan.leads.toLocaleString()}</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${leadsPercent}%` }} />
            </div>
          </div>

          {/* Emails meter */}
          <div className="rounded-[10px] bg-slate-50/70 p-4 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Outbound Emails</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{emailsPercent}%</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1 font-mono">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {currentWorkspace.emailsSent.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">/ {currentPlan.emails.toLocaleString()}</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${emailsPercent}%` }} />
            </div>
          </div>

          {/* SMS meter */}
          <div className="rounded-[10px] bg-slate-50/70 p-4 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>SMS Segments</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{smsPercent}%</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1 font-mono">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {currentWorkspace.smsSent.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">/ {currentPlan.sms.toLocaleString()}</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${smsPercent}%` }} />
            </div>
          </div>

          {/* Posts meter */}
          <div className="rounded-[10px] bg-slate-50/70 p-4 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Social Posts</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{postsPercent}%</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1 font-mono">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {currentWorkspace.postsPublished.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">/ {currentPlan.posts.toLocaleString()}</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${postsPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Card */}
      <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/10">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-blue-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Payment Method On File
            </h2>
          </div>
          <span className="text-xs text-slate-500">Stripe Customer Vault</span>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-[8px] border border-slate-200 bg-white p-2.5 shadow-xs dark:border-white/10 dark:bg-slate-800">
              <CreditCard className="h-6 w-6 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <div className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                Visa ending in 4242
              </div>
              <div className="text-[11px] text-slate-500">
                Expires 12/28 • Default billing payment method
              </div>
            </div>
          </div>

          <button
            onClick={() => showToast('Payment method verified in test sandbox')}
            className="rounded-[10px] border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Update Card
          </button>
        </div>
      </div>

      {/* Invoice History */}
      <div className="rounded-[14px] border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70 overflow-hidden">
        <div className="p-4 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Billing History & Receipts
          </h2>
          <span className="text-xs text-slate-500">Past automated invoice statements</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Invoice ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3 font-mono font-medium text-slate-900 dark:text-white">
                  {inv.id}
                </td>
                <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                  {inv.date}
                </td>
                <td className="px-4 py-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                  ${inv.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => showToast(`Downloaded invoice statement ${inv.id}.pdf`)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cancellation Section */}
      <div className="rounded-[14px] border border-rose-500/20 bg-rose-500/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold text-rose-900 dark:text-rose-300">
            Cancel Subscription
          </h3>
          <p className="mt-0.5 text-xs text-rose-800/80 dark:text-rose-400/80">
            Pauses automated outreach sequences and stops renewal charges at current period end.
          </p>
        </div>

        <button
          onClick={() => setShowCancelDialog(true)}
          className="rounded-[10px] border border-rose-300 bg-white px-3.5 py-1.5 text-xs font-medium text-rose-700 shadow-xs hover:bg-rose-50 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-950/30"
        >
          Cancel Subscription
        </button>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl rounded-[14px] border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Select Subscription Plan
                </h3>
                <p className="text-xs text-slate-500">
                  Select a tier matching your monthly prospecting volume.
                </p>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {planDefinitions.map((plan) => {
                const isCurrent = currentWorkspace.plan === plan.name;

                return (
                  <div
                    key={plan.name}
                    className={`rounded-[12px] border p-4 flex flex-col justify-between ${
                      isCurrent
                        ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/20'
                        : 'border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {plan.name}
                        </span>
                        {isCurrent && (
                          <span className="rounded-full bg-blue-600 text-[10px] font-semibold text-white px-2 py-0.5">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="mt-2 font-mono">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          ${plan.price}
                        </span>
                        <span className="text-xs text-slate-400"> /mo</span>
                      </div>

                      <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                        <li>• {plan.leads.toLocaleString()} verified leads</li>
                        <li>• {plan.emails.toLocaleString()} outbound emails</li>
                        <li>• {plan.sms.toLocaleString()} SMS segments</li>
                        <li>• {plan.posts} social posts</li>
                        <li>• {plan.seats} team seats</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSelectPlan(plan.name)}
                      disabled={isCurrent}
                      className={`mt-6 w-full rounded-[10px] py-2 text-xs font-medium transition-all ${
                        isCurrent
                          ? 'bg-slate-100 text-slate-400 cursor-default dark:bg-slate-800'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                      }`}
                    >
                      {isCurrent ? 'Current Plan' : `Switch to ${plan.name}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-[14px] border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Confirm Subscription Cancellation
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Are you sure you want to cancel your plan? Outbound sequences will finish their current cycle and new lead generation runs will pause.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="rounded-[10px] border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleConfirmCancel}
                className="rounded-[10px] bg-rose-600 px-4 py-2 text-xs font-medium text-white hover:bg-rose-700 shadow-sm"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
