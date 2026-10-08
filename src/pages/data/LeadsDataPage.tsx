import React, { useState } from 'react';
import {
  Database,
  Search,
  Filter,
  X,
  Clock,
  ShieldCheck,
  Tag,
  FileText,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { Lead, CrmStage } from '../../types';

export const LeadsDataPage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const leads = useDemoStore((state) => state.leads).filter((l) => l.workspace_id === currentWorkspaceId);
  const updateLead = useDemoStore((state) => state.updateLead);

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = leads.filter((l) => {
    if (stageFilter !== 'all' && l.stage !== stageFilter) return false;
    if (sourceFilter !== 'all' && l.source !== sourceFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        l.fullName.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">04 DATA</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Supabase</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Supabase (PostgreSQL) Leads Repository
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Primary relational contacts store isolated by workspace_id, holding enriched dossiers, consent hashes, and audit lineage.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="leads" count={filteredLeads.length} />
          <DiagramChip reference="04 Data / Supabase (PostgreSQL)" type="database" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, company, email, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">Stage:</span>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-2 py-1 text-xs rounded-control bg-slate-100 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All stages</option>
              <option value="Lead">Lead</option>
              <option value="Contacted">Contacted</option>
              <option value="Engaged">Engaged</option>
              <option value="Qualified">Qualified</option>
              <option value="Appointment">Appointment</option>
              <option value="Opportunity">Opportunity</option>
              <option value="Customer">Customer</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-2 py-1 text-xs rounded-control bg-slate-100 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All sources</option>
              <option value="apollo_b2b">apollo_b2b</option>
              <option value="web_form">web_form</option>
              <option value="meta_ad">meta_ad</option>
              <option value="csv_import">csv_import</option>
              <option value="inbound_social">inbound_social</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Leads Table */}
      <div className="glass-dense rounded-panel overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs table-compact border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono uppercase text-slate-500 bg-slate-100/40 dark:bg-slate-900/40">
                <th className="px-3 py-2 font-medium">Lead Name</th>
                <th className="px-3 py-2 font-medium">Company & Title</th>
                <th className="px-3 py-2 font-medium">Contact Details</th>
                <th className="px-3 py-2 font-medium">Source</th>
                <th className="px-3 py-2 font-medium">Stage</th>
                <th className="px-3 py-2 font-medium">AI Score</th>
                <th className="px-3 py-2 font-medium">Consent</th>
                <th className="px-3 py-2 font-medium text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="hover:bg-slate-200/40 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="px-3 py-2 font-semibold text-slate-900 dark:text-slate-100">
                    {lead.fullName}
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-slate-800 dark:text-slate-200">{lead.company}</div>
                    <div className="text-[10px] text-slate-500">{lead.title}</div>
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    <div>{lead.email}</div>
                    <div className="text-[10px] text-slate-500">{lead.phone}</div>
                  </td>
                  <td className="px-3 py-2 font-mono text-[10px] text-slate-500 uppercase">
                    {lead.source.replace('_', ' ')}
                  </td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-200/60 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200">
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        lead.score >= 80 ? 'text-emerald-600' : 'text-blue-600'
                      }`}
                    >
                      {lead.score}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                        lead.consent.status === 'opted_in'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : lead.consent.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-600'
                          : 'bg-red-500/10 text-red-600'
                      }`}
                    >
                      {lead.consent.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLead(lead);
                      }}
                      className="px-2 py-1 text-[11px] rounded bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Detail Drawer (Level 2 surface) */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm animate-fade-in flex justify-end">
          <div className="w-full max-w-xl glass-modal h-full p-6 overflow-y-auto space-y-6 shadow-2xl border-l border-slate-300/40 dark:border-slate-800/60">
            {/* Drawer Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300 font-semibold">
                    PROSPECT DOSSIER
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    ID: {selectedLead.id}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-1">
                  {selectedLead.fullName}
                </h3>
                <div className="text-xs text-slate-500">
                  {selectedLead.title} at {selectedLead.company}
                </div>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-control text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact & Scope Strip */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-control bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/40">
                <div className="text-[10px] uppercase text-slate-500">Email Address</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                  {selectedLead.email}
                </div>
              </div>
              <div className="p-3 rounded-control bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/40">
                <div className="text-[10px] uppercase text-slate-500">Direct Phone</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedLead.phone}
                </div>
              </div>
            </div>

            {/* Score & Rationale */}
            <div className="p-4 rounded-control bg-blue-500/10 border border-blue-500/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                  AI Fit Score: {selectedLead.score}/100
                </span>
                <span className="text-[10px] font-mono text-blue-700 dark:text-blue-300">
                  Tier 1 Evaluated
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                {selectedLead.scoreReason}
              </p>
            </div>

            {/* Consent & Compliance */}
            <div className="p-4 rounded-control border border-slate-200/60 dark:border-slate-800/60 space-y-2 text-xs">
              <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>Verified Consent Lineage</span>
                <span className="text-[10px] font-mono uppercase text-emerald-600">
                  {selectedLead.consent.status}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-0.5">
                <div>Source Proof: {selectedLead.consent.source}</div>
                <div>Capture Date: {selectedLead.consent.date}</div>
                <div>Tenant Scope: workspace_id = '{selectedLead.workspace_id}'</div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <div className="text-xs font-mono uppercase text-slate-500">Assigned Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedLead.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase font-semibold text-slate-700 dark:text-slate-300">
                Audited Interaction Timeline
              </div>
              <div className="space-y-2.5 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {selectedLead.timeline.map((evt) => (
                  <div key={evt.id} className="relative flex items-start gap-3 pl-1 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent mt-1 z-10 shrink-0" />
                    <div className="flex-1 p-3 rounded-control bg-slate-100/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
                      <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                        <span>{evt.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">{evt.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-mono">
                        {evt.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operator Notes */}
            <div className="space-y-1.5">
              <div className="text-xs font-mono uppercase text-slate-500">Internal Rep Notes</div>
              <textarea
                rows={2}
                value={selectedLead.notes || ''}
                onChange={(e) => updateLead(selectedLead.id, { notes: e.target.value })}
                className="w-full p-2.5 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
