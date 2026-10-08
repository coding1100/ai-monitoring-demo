import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Check,
  X,
  MessageSquare,
  AlertCircle,
  Clock,
  DollarSign,
  Users,
  Send,
  ArrowRight,
  GitFork,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { PlannedCampaign } from '../../types';

export const ApprovalGatePage: React.FC = () => {
  const navigate = useNavigate();
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const plans = useDemoStore((state) => state.plans).filter((p) => p.workspace_id === currentWorkspaceId);
  const approvePlan = useDemoStore((state) => state.approvePlan);
  const rejectPlan = useDemoStore((state) => state.rejectPlan);
  const requestChanges = useDemoStore((state) => state.requestChanges);

  const pendingPlans = plans.filter((p) => p.status === 'pending_approval');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    pendingPlans[0]?.id || plans[0]?.id || ''
  );
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [changesComment, setChangesComment] = useState('Please throttle daily sends to 30 per inbox.');

  const selectedPlan: PlannedCampaign | undefined =
    plans.find((p) => p.id === selectedPlanId) || plans[0];

  const handleApprove = async () => {
    if (!selectedPlan) return;
    approvePlan(selectedPlan.id);
  };

  const handleReject = async () => {
    if (!selectedPlan) return;
    rejectPlan(selectedPlan.id);
  };

  const handleSubmitChanges = async () => {
    if (!selectedPlan) return;
    requestChanges(selectedPlan.id, changesComment);
    setCommentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">01 CONTROL</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Approval Gate</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Human-in-the-Loop Approval Gate
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Review and certify planned AI campaigns, budget caps, and multi-channel outreach parameters.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="approval_queue" count={pendingPlans.length} />
          <DiagramChip reference="01 Control / Approval gate" type="built" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pending Plans Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-dense p-4 rounded-panel">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
              <span className="text-xs font-mono uppercase font-semibold text-slate-700 dark:text-slate-300">
                Pending Plans Queue ({pendingPlans.length})
              </span>
              <span className="text-[10px] font-mono text-slate-500">All: {plans.length}</span>
            </div>

            <div className="space-y-2">
              {plans.map((p) => {
                const isSelected = p.id === selectedPlanId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`p-3.5 rounded-control cursor-pointer transition-all border text-xs ${
                      isSelected
                        ? 'bg-blue-500/10 border-accent shadow-sm'
                        : 'border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-200/40 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {p.audience}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-[4px] capitalize ${
                          p.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : p.status === 'pending_approval'
                            ? 'bg-amber-500/10 text-amber-600'
                            : p.status === 'changes_requested'
                            ? 'bg-blue-500/10 text-blue-600'
                            : 'bg-red-500/10 text-red-600'
                        }`}
                      >
                        {p.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 font-mono">
                      "{p.prompt}"
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/40 dark:border-slate-800/40 text-[10px] font-mono text-slate-400">
                      <span>{p.count} leads</span>
                      <span>${p.estimatedCost.toFixed(2)}</span>
                      <span>{p.createdAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Detail Panel */}
        <div className="lg:col-span-7 space-y-4">
          {selectedPlan ? (
            <div className="glass-panel p-6 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500">Plan Inspection</div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {selectedPlan.audience}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    Plan ID: {selectedPlan.id} | Created: {selectedPlan.createdAt}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono px-2.5 py-1 rounded-[6px] capitalize ${
                      selectedPlan.status === 'approved'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-medium'
                        : selectedPlan.status === 'pending_approval'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-medium animate-pulse'
                        : selectedPlan.status === 'changes_requested'
                        ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 font-medium'
                        : 'bg-red-500/15 text-red-700 dark:text-red-300 font-medium'
                    }`}
                  >
                    Status: {selectedPlan.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Limits and Cap Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-control bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40">
                  <div className="text-[10px] font-mono uppercase text-slate-500">Audience Size</div>
                  <div className="text-sm font-semibold font-mono-numbers text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedPlan.count} leads
                  </div>
                </div>
                <div className="p-3 rounded-control bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40">
                  <div className="text-[10px] font-mono uppercase text-slate-500">Daily Send Limit</div>
                  <div className="text-sm font-semibold font-mono-numbers text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedPlan.dailySendLimit} / day
                  </div>
                </div>
                <div className="p-3 rounded-control bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40">
                  <div className="text-[10px] font-mono uppercase text-slate-500">Spend Cap</div>
                  <div className="text-sm font-semibold font-mono-numbers text-slate-800 dark:text-slate-200 mt-0.5">
                    ${selectedPlan.targetSpendCap}.00
                  </div>
                </div>
                <div className="p-3 rounded-control bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40">
                  <div className="text-[10px] font-mono uppercase text-slate-500">Estimated Cost</div>
                  <div className="text-sm font-semibold font-mono-numbers text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ${selectedPlan.estimatedCost.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Feedback comment if requested */}
              {selectedPlan.feedbackComment && (
                <div className="p-3.5 rounded-control bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                  <div className="font-semibold mb-0.5">Changes Requested by Operator:</div>
                  <p className="font-mono">{selectedPlan.feedbackComment}</p>
                </div>
              )}

              {/* Message Samples */}
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase font-semibold text-slate-700 dark:text-slate-300">
                  Personalization Samples ({selectedPlan.sampleMessages.length})
                </div>
                <div className="space-y-2">
                  {selectedPlan.sampleMessages.map((msg, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-control border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 text-xs space-y-1 font-mono"
                    >
                      <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {msg.channel}: {msg.subject || 'Outbound Hook'}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {msg.body}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  {selectedPlan.status === 'approved' ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Plan approved. Dispatched to n8n Orchestrator.
                    </span>
                  ) : (
                    <span>Approving instantly provisions an n8n workflow execution.</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {selectedPlan.status !== 'approved' && (
                    <>
                      <ActionButton
                        rbacAction="approve_plan"
                        variant="danger"
                        size="sm"
                        onAsyncClick={handleReject}
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </ActionButton>

                      <ActionButton
                        rbacAction="approve_plan"
                        variant="secondary"
                        size="sm"
                        onClick={() => setCommentModalOpen(true)}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Request Changes</span>
                      </ActionButton>

                      <ActionButton
                        rbacAction="approve_plan"
                        variant="primary"
                        size="sm"
                        onAsyncClick={handleApprove}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Plan</span>
                      </ActionButton>
                    </>
                  )}

                  {selectedPlan.status === 'approved' && (
                    <button
                      onClick={() => navigate('/orchestration/runs')}
                      className="px-3 py-1.5 text-xs font-medium rounded-control bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <GitFork className="w-3.5 h-3.5" />
                      <span>View in Orchestration Runs</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-xs text-slate-500">
              No plan selected from queue.
            </div>
          )}
        </div>
      </div>

      {/* Request Changes Modal */}
      {commentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="glass-modal max-w-md w-full p-6 space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Request Changes on Campaign Plan
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Provide specific operational instructions for the prompt compiler or copy engineer.
            </p>
            <textarea
              rows={3}
              value={changesComment}
              onChange={(e) => setChangesComment(e.target.value)}
              className="w-full p-3 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-accent font-mono"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCommentModalOpen(false)}
                className="px-3 py-1.5 text-xs rounded-control bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <ActionButton
                variant="primary"
                size="sm"
                onAsyncClick={handleSubmitChanges}
              >
                Submit Feedback
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
