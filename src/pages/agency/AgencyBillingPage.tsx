import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Tag,
  FileText,
  DollarSign,
  Download,
  Search,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { useDemoStore } from '../../store/useDemoStore';
import { AgencySubscription, AgencyInvoice } from '../../types';

export const AgencyBillingPage: React.FC = () => {
  const agencySubscriptions = useDemoStore((state) => state.agencySubscriptions);
  const agencyInvoices = useDemoStore((state) => state.agencyInvoices);
  const retryFailedPayment = useDemoStore((state) => state.retryFailedPayment);

  const [search, setSearch] = useState('');
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRetryPayment = async (sub: AgencySubscription) => {
    setRetryingId(sub.id);
    await retryFailedPayment(sub.id);
    setRetryingId(null);
    showToast(`Payment retried successfully for ${sub.customerName}. Subscription active.`);
  };

  const failedSubscriptions = agencySubscriptions.filter((s) => s.status === 'past_due');
  const activeSubscriptions = agencySubscriptions.filter((s) =>
    s.customerName.toLowerCase().includes(search.toLowerCase()) ||
    s.plan.toLowerCase().includes(search.toLowerCase())
  );

  const coupons = [
    { code: 'FOUNDER20', discount: '20% recurring', redemptions: 4, status: 'Active' },
    { code: 'ANNUAL15', discount: '15% annual prepaid', redemptions: 7, status: 'Active' },
    { code: 'MEDSPA_Q4', discount: '$50 off first 3 months', redemptions: 2, status: 'Active' },
  ];

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 p-3 rounded-control glass-modal border border-accent bg-blue-600/15 text-xs text-slate-900 dark:text-slate-100 shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-accent" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-accent">AGENCY CONTROL TOWER</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Billing & Subscriptions</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Stripe Subscription Management & Invoicing Ledger
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Real-time customer billing cycles, past due dunning recovery, and coupon campaign redemption.
          </p>
        </div>

        <DiagramChip reference="Agency / Stripe Billing" type="bought" />
      </div>

      {/* Failed Payments Dunning Queue (If any) */}
      {failedSubscriptions.length > 0 && (
        <div className="p-4 rounded-panel bg-amber-500/10 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-amber-900 dark:text-amber-200">
                Failed Payments & Dunning Queue ({failedSubscriptions.length} Pending Retry)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-700 dark:text-amber-300">Automated Smart Retries: 2 of 4</span>
          </div>

          <div className="space-y-2">
            {failedSubscriptions.map((sub) => (
              <div
                key={sub.id}
                className="p-3 rounded-control bg-white/60 dark:bg-slate-900/60 border border-amber-500/20 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{sub.customerName}</div>
                  <div className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">
                    Past due invoice amount: ${sub.amount} | Method: {sub.paymentMethod}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={retryingId === sub.id}
                  onClick={() => handleRetryPayment(sub)}
                  className="px-3 py-1.5 text-xs font-medium rounded-control bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className={`w-3 h-3 ${retryingId === sub.id ? 'animate-spin' : ''}`} />
                  <span>{retryingId === sub.id ? 'Retrying Charge...' : 'Retry Payment'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscriptions Table */}
      <div className="glass-dense rounded-panel overflow-hidden border border-slate-200/60 dark:border-slate-800/60 space-y-3 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
            Active Tenant Subscriptions
          </h3>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer..."
              aria-label="Search customer subscription"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs table-compact border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono uppercase text-slate-500 bg-slate-100/40 dark:bg-slate-900/40">
                <th className="px-3 py-2 font-medium">Customer</th>
                <th className="px-3 py-2 font-medium">Plan</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Billing Period End</th>
                <th className="px-3 py-2 font-medium">Monthly Amount</th>
                <th className="px-3 py-2 font-medium">Payment Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
              {activeSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-200/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-2.5 font-semibold text-slate-900 dark:text-slate-100">
                    {sub.customerName}
                  </td>
                  <td className="px-3 py-2.5 font-mono">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300">
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                        sub.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : sub.status === 'trialing'
                          ? 'bg-blue-500/10 text-blue-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {sub.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-slate-600 dark:text-slate-400">
                    {sub.nextInvoice}
                  </td>
                  <td className="px-3 py-2.5 font-mono font-semibold text-slate-900 dark:text-slate-100">
                    ${sub.amount} / mo
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-slate-500">
                    {sub.paymentMethod}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoices & Coupons Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoices List (2 cols) */}
        <div className="lg:col-span-2 glass-dense p-5 rounded-panel space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              Recent Billing Invoices
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Auto-synced with Stripe Webhooks</span>
          </div>

          <div className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
            {agencyInvoices.map((inv) => (
              <div key={inv.id} className="py-2.5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{inv.workspaceName}</div>
                    <div className="text-[10px] text-slate-500">{inv.id} | {inv.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">${inv.amount}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                    }`}
                  >
                    {inv.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => showToast(`Downloaded invoice statement ${inv.id}`)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    title="Download invoice statement"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coupons List (1 col) */}
        <div className="glass-dense p-5 rounded-panel space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              Promotional Coupons
            </h3>
            <Tag className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="space-y-2">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="p-3 rounded-control bg-slate-100/40 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-accent text-xs">{c.code}</span>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {c.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-700 dark:text-slate-300">{c.discount}</div>
                <div className="text-[10px] text-slate-500 font-mono">{c.redemptions} active redemptions</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
