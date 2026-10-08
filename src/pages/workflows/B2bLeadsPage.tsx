import React, { useState } from 'react';
import {
  Target,
  Filter,
  CheckCircle2,
  Sliders,
  Sparkles,
  Users,
  Database,
  ArrowRight,
  ShieldCheck,
  Building,
  RefreshCw,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { fakeDelay } from '../../utils/seededRandom';

export const B2bLeadsPage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const leads = useDemoStore((state) => state.leads).filter(
    (l) => l.workspace_id === currentWorkspaceId && l.source === 'apollo_b2b'
  );
  const addLead = useDemoStore((state) => state.addLead);

  // Wizard criteria state
  const [industry, setIndustry] = useState('Medical Aesthetics & Dermatology');
  const [location, setLocation] = useState('New York Metro (NY, NJ, CT)');
  const [companySize, setCompanySize] = useState('11-50 employees');
  const [titles, setTitles] = useState('Clinic Owner, Medical Director, Managing Partner');
  const [dailyVolume, setDailyVolume] = useState<number>(150);
  const [isSimulatingIngest, setIsSimulatingIngest] = useState(false);

  // Calculated live preview count based on criteria
  const estimatedMatches = Math.floor(dailyVolume * 3.4);
  const dedupePassed = Math.floor(estimatedMatches * 0.94);

  const handleSimulateBatchAcquisition = async () => {
    setIsSimulatingIngest(true);
    await fakeDelay(700);

    // Ingest new lead
    addLead({
      id: `lead_${currentWorkspaceId}_b2b_${Date.now().toString().slice(-4)}`,
      workspace_id: currentWorkspaceId,
      fullName: 'Dr. Evelyn Sterling',
      email: 'dr.sterling@sohoaestheticscare.com',
      phone: '+1 (212) 555-0988',
      title: 'Medical Director',
      company: 'SoHo Aesthetic Care',
      location: 'New York, NY',
      source: 'apollo_b2b',
      stage: 'Lead',
      score: 94,
      scoreReason: 'Apollo match: Active commercial dermatologic facility with 4 providers',
      consent: { status: 'opted_in', date: '2026-03-28', source: 'Apollo Verified B2B' },
      tags: ['apollo_b2b', 'high_ticket', 'medspa_owner'],
      timeline: [
        {
          id: `tl_${Date.now()}`,
          date: '2026-03-28 11:45',
          type: 'form_submit',
          title: 'Acquired via Apollo B2B Criteria Wizard',
          note: `Matched criteria: ${industry} in ${location}.`,
        },
      ],
      updatedAt: '2026-03-28 11:45',
    });

    setIsSimulatingIngest(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">03 WORKFLOWS</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">B2B Leads</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            B2B Leads Acquisition & Scoring Wizard
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Configure Apollo.io prospecting parameters, live audience previews, and enrichment scoring models.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="b2b_lead_cache" count={leads.length} />
          <DiagramChip reference="03 Workflows / B2B leads / Apollo" type="built" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Criteria Wizard & Settings */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-dense p-5 rounded-panel space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
                Apollo Search Criteria
              </h3>
              <span className="text-[10px] font-mono text-emerald-600">Apollo API v2 Connected</span>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="b2b-industry" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Vertical / Industry
                </label>
                <input
                  id="b2b-industry"
                  type="text"
                  aria-label="Target Vertical / Industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="b2b-location" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Geographic Location
                </label>
                <input
                  id="b2b-location"
                  type="text"
                  aria-label="Geographic Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="b2b-headcount" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Company Headcount Range
                </label>
                <select
                  id="b2b-headcount"
                  aria-label="Company Headcount Range"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="1-10 employees">1-10 employees (Boutique Practice)</option>
                  <option value="11-50 employees">11-50 employees (Mid-sized Med Spa)</option>
                  <option value="51-200 employees">51-200 employees (Multi-Location Group)</option>
                </select>
              </div>

              <div>
                <label htmlFor="b2b-titles" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Decision-Maker Titles
                </label>
                <input
                  id="b2b-titles"
                  type="text"
                  aria-label="Target Decision-Maker Titles"
                  value={titles}
                  onChange={(e) => setTitles(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Volume Slider: 100 to 500+ */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="b2b-daily-quota" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Daily Ingest Quota
                  </label>
                  <span className="text-xs font-mono font-semibold text-accent">
                    {dailyVolume} leads / day
                  </span>
                </div>
                <input
                  id="b2b-daily-quota"
                  type="range"
                  aria-label="Daily Ingest Quota"
                  min={100}
                  max={500}
                  step={25}
                  value={dailyVolume}
                  onChange={(e) => setDailyVolume(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>100</span>
                  <span>250</span>
                  <span>500+</span>
                </div>
              </div>

              {/* Live Count Preview Card */}
              <div className="p-3.5 rounded-control bg-blue-500/10 border border-blue-500/20 text-xs space-y-2 mt-2">
                <div className="font-semibold text-blue-900 dark:text-blue-200 flex items-center justify-between">
                  <span>Live Audience Estimate</span>
                  <span className="font-mono">{estimatedMatches} Total Matches</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                  <div>Dedupe Passed: {dedupePassed}</div>
                  <div>ZeroBounce Ready: 100%</div>
                </div>
              </div>

              <div className="pt-2">
                <ActionButton
                  rbacAction="create_plan"
                  variant="primary"
                  className="w-full"
                  onAsyncClick={handleSimulateBatchAcquisition}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Execute Sample Acquisition</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ingested Prospects Results */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
                Acquired B2B Prospects ({leads.length} Records)
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                Sorted by AI Fit Score
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs table-compact">
                <thead>
                  <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono uppercase text-slate-500 bg-slate-100/40 dark:bg-slate-900/40">
                    <th className="px-3 py-2 font-medium">Contact & Role</th>
                    <th className="px-3 py-2 font-medium">Company</th>
                    <th className="px-3 py-2 font-medium">Location</th>
                    <th className="px-3 py-2 font-medium">Fit Score</th>
                    <th className="px-3 py-2 font-medium">Scoring Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
                  {leads.slice(0, 8).map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-200/40 dark:hover:bg-slate-800/40">
                      <td className="px-3 py-2">
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {lead.fullName}
                        </div>
                        <div className="text-[10px] text-slate-500">{lead.title}</div>
                      </td>
                      <td className="px-3 py-2 text-slate-800 dark:text-slate-200">
                        {lead.company}
                      </td>
                      <td className="px-3 py-2 text-slate-500">{lead.location}</td>
                      <td className="px-3 py-2 font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            lead.score >= 85
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-blue-500/10 text-blue-600'
                          }`}
                        >
                          {lead.score}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-400 text-[11px] max-w-[200px] truncate" title={lead.scoreReason}>
                        {lead.scoreReason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
