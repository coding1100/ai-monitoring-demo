import React, { useState } from 'react';
import {
  DollarSign,
  Calculator,
  Sliders,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Layers,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { useDemoStore } from '../../store/useDemoStore';
import { PlanTier, PlanDefinition, PricingAssumptions } from '../../types';
import { calculateTierForecast } from '../../data/agencyMockData';

export const AgencyPricingForecastPage: React.FC = () => {
  const planDefinitions = useDemoStore((state) => state.planDefinitions);
  const pricingAssumptions = useDemoStore((state) => state.pricingAssumptions);
  const updatePlanDefinition = useDemoStore((state) => state.updatePlanDefinition);
  const updatePricingAssumption = useDemoStore((state) => state.updatePricingAssumption);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const clientScales = [10, 25, 50, 100];
  const forecasts = clientScales.map((count) =>
    calculateTierForecast(count, planDefinitions, pricingAssumptions)
  );

  return (
    <div className="space-y-6 animate-fade-in relative">
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
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pricing & Forecast</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Subscription Pricing Architecture & Profitability Modeling
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Live client tier configuration with dynamic browser-computed COGS, API unit economics, and margin projections.
          </p>
        </div>

        <DiagramChip reference="Agency / Financial Modeling" type="built" />
      </div>

      {/* Editable Tier Table */}
      <div className="glass-dense p-5 rounded-panel space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Subscription Tiers Configuration
            </h3>
            <p className="text-[11px] text-slate-500">
              Adjust monthly plan prices, monthly quotas, and included AI compute allowances.
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
            Live reactive recalculation enabled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {planDefinitions.map((p) => (
            <div
              key={p.name}
              className="p-4 rounded-control border border-slate-200/60 dark:border-slate-800/60 bg-slate-100/40 dark:bg-slate-900/40 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-2">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100 font-mono">
                  {p.name} Tier
                </span>
                <span className="text-xs font-mono text-blue-600 font-semibold">
                  ${p.price} / mo
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-mono text-slate-500 block mb-0.5">
                    Monthly Price ($)
                  </label>
                  <input
                    type="number"
                    aria-label={`${p.name} monthly price`}
                    value={p.price}
                    onChange={(e) => {
                      updatePlanDefinition(p.name, { price: Number(e.target.value) });
                      showToast(`Updated ${p.name} price to $${e.target.value}`);
                    }}
                    className="w-full px-2.5 py-1 text-xs font-mono rounded bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-500 block mb-0.5">
                      Included Leads
                    </label>
                    <input
                      type="number"
                      aria-label={`${p.name} included leads`}
                      value={p.leads}
                      onChange={(e) => {
                        updatePlanDefinition(p.name, { leads: Number(e.target.value) });
                      }}
                      className="w-full px-2.5 py-1 text-xs font-mono rounded bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-500 block mb-0.5">
                      Included Emails
                    </label>
                    <input
                      type="number"
                      aria-label={`${p.name} included emails`}
                      value={p.emails}
                      onChange={(e) => {
                        updatePlanDefinition(p.name, { emails: Number(e.target.value) });
                      }}
                      className="w-full px-2.5 py-1 text-xs font-mono rounded bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-500 block mb-0.5">
                      Included SMS
                    </label>
                    <input
                      type="number"
                      aria-label={`${p.name} included SMS`}
                      value={p.sms}
                      onChange={(e) => {
                        updatePlanDefinition(p.name, { sms: Number(e.target.value) });
                      }}
                      className="w-full px-2.5 py-1 text-xs font-mono rounded bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-500 block mb-0.5">
                      Included AI Spend ($)
                    </label>
                    <input
                      type="number"
                      aria-label={`${p.name} included AI spend`}
                      value={p.includedAiSpend}
                      onChange={(e) => {
                        updatePlanDefinition(p.name, { includedAiSpend: Number(e.target.value) });
                      }}
                      className="w-full px-2.5 py-1 text-xs font-mono rounded bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Forecast Matrix for 10, 25, 50, 100 Clients */}
      <div className="glass-dense p-5 rounded-panel space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Live Scale Projections (10, 25, 50, 100 Workspaces)
          </h3>
          <p className="text-[11px] text-slate-500">
            Computed monthly revenue, direct infrastructure/API expenses, and net agency margin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {forecasts.map((f) => (
            <div
              key={f.clientCount}
              className="p-4 rounded-control border border-slate-200/60 dark:border-slate-800/60 bg-slate-100/40 dark:bg-slate-900/40 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-accent">
                  {f.clientCount} Clients
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {f.starterCount}S / {f.growthCount}G / {f.scaleCount}Sc
                </span>
              </div>

              <div>
                <div className="text-[10px] uppercase font-mono text-slate-500">Monthly Revenue</div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
                  ${f.monthlyRevenue.toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Total COGS</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">${f.totalCost.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Gross Margin</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    {f.grossMarginPercent}%
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                Net Profit: +${f.grossMarginDollars.toLocaleString()} / mo
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assumptions Panel */}
      <div className="glass-panel p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              Unit Cost Assumptions & Provider Tariffs
            </h3>
            <p className="text-[11px] text-slate-500">
              Modifying these inputs updates all COGS and margin forecast cards instantly.
            </p>
          </div>
          <Calculator className="w-4 h-4 text-accent" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
              Avg Tokens / Lead
            </label>
            <input
              type="number"
              aria-label="Average tokens per lead"
              value={pricingAssumptions.avgTokensPerLead}
              onChange={(e) => {
                updatePricingAssumption('avgTokensPerLead', Number(e.target.value));
              }}
              className="w-full px-2 py-1 text-xs font-mono rounded bg-slate-100 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
              Small Model / 1M ($)
            </label>
            <input
              type="number"
              step="0.01"
              aria-label="Cost per 1M tokens small model"
              value={pricingAssumptions.costPer1mSmallModel}
              onChange={(e) => {
                updatePricingAssumption('costPer1mSmallModel', Number(e.target.value));
              }}
              className="w-full px-2 py-1 text-xs font-mono rounded bg-slate-100 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
              Large Model / 1M ($)
            </label>
            <input
              type="number"
              step="0.1"
              aria-label="Cost per 1M tokens large model"
              value={pricingAssumptions.costPer1mLargeModel}
              onChange={(e) => {
                updatePricingAssumption('costPer1mLargeModel', Number(e.target.value));
              }}
              className="w-full px-2 py-1 text-xs font-mono rounded bg-slate-100 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
              Apollo Cost / Lead ($)
            </label>
            <input
              type="number"
              step="0.005"
              aria-label="Apollo cost per lead"
              value={pricingAssumptions.apolloCostPerLead}
              onChange={(e) => {
                updatePricingAssumption('apolloCostPerLead', Number(e.target.value));
              }}
              className="w-full px-2 py-1 text-xs font-mono rounded bg-slate-100 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
              Email Cost / 1k ($)
            </label>
            <input
              type="number"
              step="0.05"
              aria-label="Email cost per 1000"
              value={pricingAssumptions.emailCostPer1k}
              onChange={(e) => {
                updatePricingAssumption('emailCostPer1k', Number(e.target.value));
              }}
              className="w-full px-2 py-1 text-xs font-mono rounded bg-slate-100 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
              SMS / Segment ($)
            </label>
            <input
              type="number"
              step="0.001"
              aria-label="SMS cost per segment"
              value={pricingAssumptions.smsCostPerSegment}
              onChange={(e) => {
                updatePricingAssumption('smsCostPerSegment', Number(e.target.value));
              }}
              className="w-full px-2 py-1 text-xs font-mono rounded bg-slate-100 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
