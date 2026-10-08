import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  WorkspaceId,
  UserRole,
  Lead,
  PlannedCampaign,
  WorkflowRun,
  CodeRule,
  RuleDecisionLog,
  EmailSequence,
  EmailSenderInbox,
  ReplyItem,
  SmsRecord,
  SocialPost,
  FollowUpRule,
  SuppressionRecord,
  SystemLogEntry,
  TeamMember,
  CrmTask,
  CrmStage,
  ConnectionConfig,
} from '../types';
import {
  WORKSPACES,
  generateWorkspaceLeads,
  INITIAL_CONNECTIONS,
  INITIAL_PLANS,
  INITIAL_WORKFLOW_RUNS,
  INITIAL_CODE_RULES,
  INITIAL_RULE_LOGS,
  INITIAL_EMAIL_INBOXES,
  INITIAL_EMAIL_SEQUENCES,
  INITIAL_REPLIES,
  INITIAL_SMS_RECORDS,
  INITIAL_SOCIAL_POSTS,
  INITIAL_FOLLOWUP_RULES,
  INITIAL_SUPPRESSION_LIST,
  INITIAL_SYSTEM_LOGS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_CRM_TASKS,
} from '../data/mockData';

interface DemoState {
  currentWorkspaceId: WorkspaceId;
  currentRole: UserRole;
  showDataScope: boolean;
  darkMode: boolean;

  // Data Collections
  leads: Lead[];
  plans: PlannedCampaign[];
  runs: WorkflowRun[];
  rules: CodeRule[];
  ruleLogs: RuleDecisionLog[];
  inboxes: EmailSenderInbox[];
  sequences: EmailSequence[];
  replies: ReplyItem[];
  smsRecords: SmsRecord[];
  socialPosts: SocialPost[];
  followUpRules: FollowUpRule[];
  suppressionList: SuppressionRecord[];
  systemLogs: SystemLogEntry[];
  connections: Record<WorkspaceId, ConnectionConfig[]>;
  tasks: CrmTask[];
  teamMembers: TeamMember[];

  // Guided Flow State
  tourActive: boolean;
  tourStepIndex: number;
  tourPaused: boolean;

  // Actions
  setWorkspace: (id: WorkspaceId) => void;
  setRole: (role: UserRole) => void;
  toggleDataScope: () => void;
  toggleDarkMode: () => void;
  resetDemo: () => void;

  // Domain Actions
  addLead: (lead: Lead) => void;
  updateLeadStage: (id: string, stage: CrmStage) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  addPlan: (plan: PlannedCampaign) => void;
  approvePlan: (planId: string) => void;
  rejectPlan: (planId: string) => void;
  requestChanges: (planId: string, comment: string) => void;
  retryRun: (runId: string) => void;
  addRun: (run: WorkflowRun) => void;
  updateRule: (ruleId: string, updates: Partial<CodeRule>) => void;
  addRuleLog: (log: RuleDecisionLog) => void;
  testConnection: (connId: string) => Promise<boolean>;
  addSuppression: (entry: SuppressionRecord) => void;
  addSocialPost: (post: SocialPost) => void;
  updateSocialPost: (id: string, updates: Partial<SocialPost>) => void;
  addReply: (reply: ReplyItem) => void;
  sendSms: (record: SmsRecord) => void;
  addCrmTask: (task: CrmTask) => void;
  toggleCrmTask: (taskId: string) => void;

  // Guided Tour Actions
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  togglePauseTour: () => void;
  endTour: () => void;
  setTourStep: (index: number) => void;
}

const getInitialData = () => {
  const allLeads = [
    ...generateWorkspaceLeads('halden'),
    ...generateWorkspaceLeads('lakeview'),
    ...generateWorkspaceLeads('ridgeway'),
  ];

  return {
    currentWorkspaceId: 'halden' as WorkspaceId,
    currentRole: 'admin' as UserRole,
    showDataScope: false,
    darkMode: false,
    leads: allLeads,
    plans: INITIAL_PLANS,
    runs: INITIAL_WORKFLOW_RUNS,
    rules: INITIAL_CODE_RULES,
    ruleLogs: INITIAL_RULE_LOGS,
    inboxes: INITIAL_EMAIL_INBOXES,
    sequences: INITIAL_EMAIL_SEQUENCES,
    replies: INITIAL_REPLIES,
    smsRecords: INITIAL_SMS_RECORDS,
    socialPosts: INITIAL_SOCIAL_POSTS,
    followUpRules: INITIAL_FOLLOWUP_RULES,
    suppressionList: INITIAL_SUPPRESSION_LIST,
    systemLogs: INITIAL_SYSTEM_LOGS,
    connections: INITIAL_CONNECTIONS,
    tasks: INITIAL_CRM_TASKS,
    teamMembers: INITIAL_TEAM_MEMBERS,
    tourActive: false,
    tourStepIndex: 0,
    tourPaused: false,
  };
};

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      ...getInitialData(),

      setWorkspace: (id: WorkspaceId) => {
        set({ currentWorkspaceId: id });
      },

      setRole: (role: UserRole) => {
        set({ currentRole: role });
      },

      toggleDataScope: () => {
        set((state) => ({ showDataScope: !state.showDataScope }));
      },

      toggleDarkMode: () => {
        set((state) => {
          const nextMode = !state.darkMode;
          if (nextMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { darkMode: nextMode };
        });
      },

      resetDemo: () => {
        const fresh = getInitialData();
        set(fresh);
        localStorage.removeItem('ai_marketing_demo_storage');
        document.documentElement.classList.remove('dark');
      },

      addLead: (lead: Lead) => {
        set((state) => ({
          leads: [lead, ...state.leads],
          systemLogs: [
            {
              id: `log_${Date.now()}`,
              workspace_id: lead.workspace_id,
              type: 'workflow',
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              actor: 'Data Pipeline',
              action: 'New Lead Ingested',
              details: `Added ${lead.fullName} (${lead.company}) via ${lead.source}`,
              status: 'success',
            },
            ...state.systemLogs,
          ],
        }));
      },

      updateLeadStage: (id: string, stage: CrmStage) => {
        set((state) => {
          const lead = state.leads.find((l) => l.id === id);
          if (!lead) return state;

          const updatedTimeline = [
            {
              id: `tl_${Date.now()}`,
              date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              type: 'stage_changed' as const,
              title: `Stage moved to ${stage}`,
              note: `Updated manually or via automation rule.`,
            },
            ...lead.timeline,
          ];

          return {
            leads: state.leads.map((l) =>
              l.id === id
                ? {
                    ...l,
                    stage,
                    timeline: updatedTimeline,
                    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
                  }
                : l
            ),
            systemLogs: [
              {
                id: `log_${Date.now()}`,
                workspace_id: lead.workspace_id,
                type: 'workflow',
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                actor: 'CRM Manager',
                action: 'Stage Transition',
                details: `Moved ${lead.fullName} to ${stage}`,
                status: 'success',
              },
              ...state.systemLogs,
            ],
          };
        });
      },

      updateLead: (id: string, updates: Partial<Lead>) => {
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        }));
      },

      addPlan: (plan: PlannedCampaign) => {
        set((state) => ({
          plans: [plan, ...state.plans],
          systemLogs: [
            {
              id: `log_${Date.now()}`,
              workspace_id: plan.workspace_id,
              type: 'ai_action',
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              actor: 'AI Command Center',
              action: 'Structured Plan Generated',
              details: `Generated plan for: "${plan.prompt.slice(0, 60)}..."`,
              status: 'success',
            },
            ...state.systemLogs,
          ],
        }));
      },

      approvePlan: (planId: string) => {
        const plan = get().plans.find((p) => p.id === planId);
        if (!plan) return;

        const newRun: WorkflowRun = {
          id: `run_${Date.now().toString().slice(-4)}`,
          workspace_id: plan.workspace_id,
          workflowName: `Execution: ${plan.audience}`,
          trigger: `Approval Gate Confirmed (${planId})`,
          status: 'running',
          startedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          duration: '32s elapsed',
          campaignId: plan.id,
          steps: [
            { id: 's1', name: 'Audience Criteria Match', status: 'done', latency: '340ms', outputSummary: `Resolved ${plan.count} target prospects` },
            { id: 's2', name: 'Email Verification Pipeline', status: 'done', latency: '820ms', outputSummary: 'ZeroBounce validation passed' },
            { id: 's3', name: 'LLM Multi-Touch Copy Generation', status: 'running', latency: '1.4s', outputSummary: 'Synthesizing personalized hooks' },
            { id: 's4', name: 'CRM Stage Association', status: 'waiting', latency: '-' },
          ],
        };

        set((state) => ({
          plans: state.plans.map((p) => (p.id === planId ? { ...p, status: 'approved' } : p)),
          runs: [newRun, ...state.runs],
          systemLogs: [
            {
              id: `log_${Date.now()}`,
              workspace_id: plan.workspace_id,
              type: 'audit',
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              actor: `${state.currentRole}@${state.currentWorkspaceId}.demo`,
              action: 'Plan Approved',
              details: `Approved campaign ${planId}. Dispatched n8n workflow ${newRun.id}.`,
              status: 'success',
            },
            ...state.systemLogs,
          ],
        }));
      },

      rejectPlan: (planId: string) => {
        set((state) => ({
          plans: state.plans.map((p) => (p.id === planId ? { ...p, status: 'rejected' } : p)),
        }));
      },

      requestChanges: (planId: string, comment: string) => {
        set((state) => ({
          plans: state.plans.map((p) =>
            p.id === planId ? { ...p, status: 'changes_requested', feedbackComment: comment } : p
          ),
        }));
      },

      retryRun: (runId: string) => {
        set((state) => ({
          runs: state.runs.map((r) =>
            r.id === runId
              ? {
                  ...r,
                  status: 'running',
                  error: undefined,
                  steps: r.steps.map((s) => ({ ...s, status: s.status === 'failed' ? 'running' : s.status })),
                }
              : r
          ),
        }));

        // Simulate retry completion after 800ms
        setTimeout(() => {
          set((state) => ({
            runs: state.runs.map((r) =>
              r.id === runId
                ? {
                    ...r,
                    status: 'success',
                    duration: '2m 14s',
                    steps: r.steps.map((s) => ({ ...s, status: 'done', latency: '420ms' })),
                  }
                : r
            ),
          }));
        }, 800);
      },

      addRun: (run: WorkflowRun) => {
        set((state) => ({ runs: [run, ...state.runs] }));
      },

      updateRule: (ruleId: string, updates: Partial<CodeRule>) => {
        set((state) => ({
          rules: state.rules.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)),
        }));
      },

      addRuleLog: (log: RuleDecisionLog) => {
        set((state) => ({ ruleLogs: [log, ...state.ruleLogs] }));
      },

      testConnection: async (connId: string) => {
        const currentWs = get().currentWorkspaceId;
        const connList = get().connections[currentWs] || [];
        const conn = connList.find((c) => c.id === connId);
        if (!conn) return false;

        // Set to testing status
        set((state) => ({
          connections: {
            ...state.connections,
            [currentWs]: state.connections[currentWs].map((c) =>
              c.id === connId ? { ...c, status: 'testing' } : c
            ),
          },
        }));

        await new Promise((r) => setTimeout(r, 650));

        // Mark connected with updated timestamp
        const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
        set((state) => ({
          connections: {
            ...state.connections,
            [currentWs]: state.connections[currentWs].map((c) =>
              c.id === connId
                ? {
                    ...c,
                    status: 'connected',
                    lastTested: nowStr,
                    details: 'Handshake 200 OK. Ping latency 380ms.',
                  }
                : c
            ),
          },
        }));
        return true;
      },

      addSuppression: (entry: SuppressionRecord) => {
        set((state) => ({
          suppressionList: [entry, ...state.suppressionList],
        }));
      },

      addSocialPost: (post: SocialPost) => {
        set((state) => ({
          socialPosts: [post, ...state.socialPosts],
        }));
      },

      updateSocialPost: (id: string, updates: Partial<SocialPost>) => {
        set((state) => ({
          socialPosts: state.socialPosts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      addReply: (reply: ReplyItem) => {
        set((state) => ({
          replies: [reply, ...state.replies],
        }));
      },

      sendSms: (record: SmsRecord) => {
        set((state) => ({
          smsRecords: [record, ...state.smsRecords],
        }));
      },

      addCrmTask: (task: CrmTask) => {
        set((state) => ({
          tasks: [task, ...state.tasks],
        }));
      },

      toggleCrmTask: (taskId: string) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
        }));
      },

      // Guided Tour
      startTour: () => {
        set({ tourActive: true, tourStepIndex: 0, tourPaused: false });
      },

      nextTourStep: () => {
        set((state) => {
          const nextIndex = state.tourStepIndex + 1;
          return { tourStepIndex: nextIndex };
        });
      },

      prevTourStep: () => {
        set((state) => ({
          tourStepIndex: Math.max(0, state.tourStepIndex - 1),
        }));
      },

      togglePauseTour: () => {
        set((state) => ({ tourPaused: !state.tourPaused }));
      },

      endTour: () => {
        set({ tourActive: false, tourStepIndex: 0, tourPaused: false });
      },

      setTourStep: (index: number) => {
        set({ tourStepIndex: index });
      },
    }),
    {
      name: 'ai_marketing_demo_storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentWorkspaceId: state.currentWorkspaceId,
        currentRole: state.currentRole,
        showDataScope: state.showDataScope,
        darkMode: state.darkMode,
        leads: state.leads,
        plans: state.plans,
        runs: state.runs,
        rules: state.rules,
        ruleLogs: state.ruleLogs,
        inboxes: state.inboxes,
        sequences: state.sequences,
        replies: state.replies,
        smsRecords: state.smsRecords,
        socialPosts: state.socialPosts,
        followUpRules: state.followUpRules,
        suppressionList: state.suppressionList,
        systemLogs: state.systemLogs,
        connections: state.connections,
        tasks: state.tasks,
        teamMembers: state.teamMembers,
      }),
    }
  )
);
