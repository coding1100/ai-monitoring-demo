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
  AppMode,
  PlanTier,
  WorkspaceStatus,
  ClientWorkspace,
  PlanDefinition,
  PricingAssumptions,
  AgencySubscription,
  AgencyInvoice,
  GhlSubAccount,
  GhlError,
  AgencyTeamMember,
  SystemWorkflowHealth,
  ClientReport,
  WebsiteInboundForm,
  IsolationAuditCheck,
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
import {
  DEFAULT_PLANS,
  DEFAULT_PRICING_ASSUMPTIONS,
  CLIENT_WORKSPACES,
  INITIAL_AGENCY_SUBSCRIPTIONS,
  INITIAL_AGENCY_INVOICES,
  INITIAL_GHL_SUBACCOUNTS,
  INITIAL_GHL_ERRORS,
  INITIAL_AGENCY_TEAM,
  INITIAL_SYSTEM_WORKFLOWS,
  INITIAL_CLIENT_REPORTS,
  INITIAL_WEBSITE_FORMS,
  INITIAL_ISOLATION_CHECKS,
} from '../data/agencyMockData';
import { fakeDelay } from '../utils/seededRandom';

export interface OnboardingState {
  step: number;
  account: {
    fullName: string;
    workEmail: string;
    companyName: string;
    industry: string;
  };
  plan: PlanTier;
  billingCycle: 'monthly' | 'yearly';
  payment: {
    cardName: string;
    cardNumber: string;
    cardExp: string;
    cardCvc: string;
    country: string;
    postalCode: string;
  };
  integrations: Record<string, boolean>;
  crmChecklist: {
    subAccountCreated: boolean;
    pipelinesMapped: boolean;
    contactsSynced: boolean;
    webhooksBound: boolean;
  };
  campaignChecklist: {
    personasDefined: boolean;
    promptTemplateReviewed: boolean;
    domainVerified: boolean;
    velocityCapSet: boolean;
    optOutGateEnabled: boolean;
  };
}

interface DemoState {
  // Top-Level SaaS Role & Tenant Scope
  appMode: AppMode;
  supportSessionWorkspace: string | null;
  currentWorkspaceId: WorkspaceId;
  currentRole: UserRole;
  showDataScope: boolean;
  darkMode: boolean;

  // Agency Layer State
  clientWorkspaces: ClientWorkspace[];
  planDefinitions: PlanDefinition[];
  pricingAssumptions: PricingAssumptions;
  agencySubscriptions: AgencySubscription[];
  agencyInvoices: AgencyInvoice[];
  ghlSubAccounts: GhlSubAccount[];
  ghlErrors: GhlError[];
  agencyTeam: AgencyTeamMember[];
  systemWorkflows: SystemWorkflowHealth[];
  isolationChecks: IsolationAuditCheck[];
  isolationAuditRunning: boolean;
  isolationAuditCompleted: boolean;

  // Client Extended Screens State
  clientReports: ClientReport[];
  websiteForms: WebsiteInboundForm[];
  websiteInboundLeadSuccess: boolean;

  // Onboarding Wizard State
  onboarding: OnboardingState;

  // Core 5-Layer Data Collections
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

  // App & Scope Actions
  setAppMode: (mode: AppMode) => void;
  startSupportSession: (workspaceId: string) => void;
  endSupportSession: () => void;
  setWorkspace: (id: WorkspaceId) => void;
  setRole: (role: UserRole) => void;
  toggleDataScope: () => void;
  toggleDarkMode: () => void;
  resetDemo: () => void;

  // Agency Actions
  toggleWorkspaceStatus: (workspaceId: string, status: WorkspaceStatus) => void;
  archiveWorkspace: (workspaceId: string) => void;
  createClientWorkspace: (data: Partial<ClientWorkspace>) => void;
  updatePricingAssumption: (key: keyof PricingAssumptions, val: number) => void;
  updatePlanDefinition: (planName: PlanTier, updates: Partial<PlanDefinition>) => void;
  retryFailedPayment: (subId: string) => Promise<boolean>;
  runIsolationAudit: () => Promise<void>;

  // Client Actions
  submitWebsiteInquiry: (inquiry: { fullName: string; email: string; phone: string; company: string; message: string }) => Promise<void>;
  updateClientWorkspacePlan: (workspaceId: string, plan: PlanTier) => void;

  // Onboarding Wizard Actions
  setOnboardingStep: (step: number) => void;
  updateOnboardingAccount: (account: Partial<OnboardingState['account']>) => void;
  setOnboardingPlan: (plan: PlanTier, billingCycle: 'monthly' | 'yearly') => void;
  updateOnboardingPayment: (payment: Partial<OnboardingState['payment']>) => void;
  toggleOnboardingIntegration: (key: string) => void;
  tickOnboardingCrmCheck: (key: keyof OnboardingState['crmChecklist']) => void;
  toggleOnboardingCampaignCheck: (key: keyof OnboardingState['campaignChecklist']) => void;
  finishOnboarding: () => string; // returns created workspace id

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

const getInitialOnboarding = (): OnboardingState => ({
  step: 1,
  account: {
    fullName: 'David Sterling',
    workEmail: 'david@sterlingmed.com',
    companyName: 'Sterling Aesthetics',
    industry: 'Medical Aesthetics',
  },
  plan: 'Growth',
  billingCycle: 'monthly',
  payment: {
    cardName: 'David Sterling',
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '123',
    country: 'United States',
    postalCode: '10001',
  },
  integrations: {
    email: true,
    sms: true,
    crm: true,
    apollo: false,
    meta: false,
  },
  crmChecklist: {
    subAccountCreated: true,
    pipelinesMapped: true,
    contactsSynced: true,
    webhooksBound: true,
  },
  campaignChecklist: {
    personasDefined: true,
    promptTemplateReviewed: true,
    domainVerified: true,
    velocityCapSet: true,
    optOutGateEnabled: true,
  },
});

const getInitialData = () => {
  const allLeads = [
    ...generateWorkspaceLeads('halden'),
    ...generateWorkspaceLeads('lakeview'),
    ...generateWorkspaceLeads('ridgeway'),
  ];

  return {
    appMode: 'client' as AppMode,
    supportSessionWorkspace: null,
    currentWorkspaceId: 'halden' as WorkspaceId,
    currentRole: 'admin' as UserRole,
    showDataScope: false,
    darkMode: false,

    clientWorkspaces: CLIENT_WORKSPACES,
    planDefinitions: DEFAULT_PLANS,
    pricingAssumptions: DEFAULT_PRICING_ASSUMPTIONS,
    agencySubscriptions: INITIAL_AGENCY_SUBSCRIPTIONS,
    agencyInvoices: INITIAL_AGENCY_INVOICES,
    ghlSubAccounts: INITIAL_GHL_SUBACCOUNTS,
    ghlErrors: INITIAL_GHL_ERRORS,
    agencyTeam: INITIAL_AGENCY_TEAM,
    systemWorkflows: INITIAL_SYSTEM_WORKFLOWS,
    isolationChecks: INITIAL_ISOLATION_CHECKS,
    isolationAuditRunning: false,
    isolationAuditCompleted: false,

    clientReports: INITIAL_CLIENT_REPORTS,
    websiteForms: INITIAL_WEBSITE_FORMS,
    websiteInboundLeadSuccess: false,

    onboarding: getInitialOnboarding(),

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

      setAppMode: (mode: AppMode) => {
        set({ appMode: mode });
      },

      startSupportSession: (workspaceId: string) => {
        set({
          supportSessionWorkspace: workspaceId,
          currentWorkspaceId: workspaceId,
          appMode: 'client',
        });
      },

      endSupportSession: () => {
        set({
          supportSessionWorkspace: null,
          appMode: 'agency',
        });
      },

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

      // Agency Actions
      toggleWorkspaceStatus: (workspaceId: string, status: WorkspaceStatus) => {
        set((state) => ({
          clientWorkspaces: state.clientWorkspaces.map((w) =>
            w.id === workspaceId ? { ...w, status } : w
          ),
        }));
      },

      archiveWorkspace: (workspaceId: string) => {
        set((state) => ({
          clientWorkspaces: state.clientWorkspaces.map((w) =>
            w.id === workspaceId ? { ...w, status: 'paused' as WorkspaceStatus } : w
          ),
        }));
      },

      createClientWorkspace: (data: Partial<ClientWorkspace>) => {
        const id = data.id || `ws-${Date.now().toString(36)}`;
        const newWs: ClientWorkspace = {
          id,
          name: data.name || 'New Client Workspace',
          industry: data.industry || 'General Services',
          type: data.type || 'B2B',
          plan: data.plan || 'Growth',
          status: 'active',
          leadsThisMonth: 0,
          emailsSent: 0,
          smsSent: 0,
          postsPublished: 0,
          aiSpend: 0,
          revenue: data.plan === 'Scale' ? 799 : data.plan === 'Starter' ? 149 : 349,
          margin: 78.0,
          crmStatus: 'connected',
          lastActivity: 'Just now',
          tokenCostPerLead: 0.026,
          tokenCostPerCampaign: 4.0,
          subAccountName: `${data.name || 'New'} GHL Account`,
          contactsSynced: 0,
          pipelinesMapped: 3,
          dailySpendCap: 25,
          modelSplit: { small: 75, large: 25 },
          conversationsNeedingReply: 0,
          ...data,
        };

        const newSub: AgencySubscription = {
          id: `sub-${Date.now().toString(36)}`,
          workspaceId: id,
          customerName: newWs.name,
          plan: newWs.plan,
          status: 'active',
          nextInvoice: '2026-11-01',
          amount: newWs.revenue,
          paymentMethod: 'Visa ending in 4242',
        };

        const newGhl: GhlSubAccount = {
          id: `ghl-${Date.now().toString(36)}`,
          workspaceId: id,
          subAccountName: newWs.subAccountName,
          locationId: `loc_${Date.now().toString(36)}`,
          syncStatus: 'Connected',
          lastSync: 'Just now',
          contactsSynced: 0,
          pipelinesMapped: 3,
          customFieldsCount: 16,
        };

        set((state) => ({
          clientWorkspaces: [newWs, ...state.clientWorkspaces],
          agencySubscriptions: [newSub, ...state.agencySubscriptions],
          ghlSubAccounts: [newGhl, ...state.ghlSubAccounts],
        }));
      },

      updatePricingAssumption: (key: keyof PricingAssumptions, val: number) => {
        set((state) => ({
          pricingAssumptions: {
            ...state.pricingAssumptions,
            [key]: val,
          },
        }));
      },

      updatePlanDefinition: (planName: PlanTier, updates: Partial<PlanDefinition>) => {
        set((state) => ({
          planDefinitions: state.planDefinitions.map((p) =>
            p.name === planName ? { ...p, ...updates } : p
          ),
        }));
      },

      retryFailedPayment: async (subId: string): Promise<boolean> => {
        await fakeDelay(500);
        set((state) => ({
          agencySubscriptions: state.agencySubscriptions.map((s) =>
            s.id === subId ? { ...s, status: 'active' } : s
          ),
          agencyInvoices: state.agencyInvoices.map((inv) =>
            inv.status === 'Failed' ? { ...inv, status: 'Paid' } : inv
          ),
        }));
        return true;
      },

      runIsolationAudit: async () => {
        set({ isolationAuditRunning: true, isolationAuditCompleted: false });
        await fakeDelay(1500);
        set({
          isolationAuditRunning: false,
          isolationAuditCompleted: true,
          isolationChecks: INITIAL_ISOLATION_CHECKS.map((c) => ({
            ...c,
            rowsReturned: 0,
            status: 'PASS',
          })),
        });
      },

      // Client Actions
      submitWebsiteInquiry: async (inquiry) => {
        await fakeDelay(450);
        const newLead: Lead = {
          id: `lead-inbound-${Date.now().toString(36)}`,
          workspace_id: get().currentWorkspaceId,
          fullName: inquiry.fullName,
          email: inquiry.email,
          phone: inquiry.phone,
          title: 'Direct Website Lead',
          company: inquiry.company || 'Private Practice',
          location: 'Inbound Webhook',
          source: 'web_form',
          stage: 'Lead',
          score: 88,
          scoreReason: 'Direct inbound web form submission with explicit consent.',
          consent: {
            status: 'opted_in',
            date: new Date().toISOString(),
            source: 'Embedded Web Form',
          },
          tags: ['website-inquiry', 'b2c-capture'],
          timeline: [
            {
              id: `evt-${Date.now()}`,
              date: 'Just now',
              type: 'form_submit',
              title: 'Website Inquiry Submitted',
              note: inquiry.message || 'Customer submitted contact inquiry via website modal.',
            },
          ],
          updatedAt: 'Just now',
        };

        set((state) => ({
          leads: [newLead, ...state.leads],
          websiteInboundLeadSuccess: true,
        }));

        setTimeout(() => {
          set({ websiteInboundLeadSuccess: false });
        }, 3000);
      },

      updateClientWorkspacePlan: (workspaceId: string, plan: PlanTier) => {
        set((state) => ({
          clientWorkspaces: state.clientWorkspaces.map((w) =>
            w.id === workspaceId ? { ...w, plan } : w
          ),
          agencySubscriptions: state.agencySubscriptions.map((s) =>
            s.workspaceId === workspaceId ? { ...s, plan } : s
          ),
        }));
      },

      // Onboarding Wizard Actions
      setOnboardingStep: (step: number) => {
        set((state) => ({
          onboarding: { ...state.onboarding, step },
        }));
      },

      updateOnboardingAccount: (patch) => {
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            account: { ...state.onboarding.account, ...patch },
          },
        }));
      },

      setOnboardingPlan: (plan: PlanTier, billingCycle: 'monthly' | 'yearly') => {
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            plan,
            billingCycle,
          },
        }));
      },

      updateOnboardingPayment: (patch) => {
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            payment: { ...state.onboarding.payment, ...patch },
          },
        }));
      },

      toggleOnboardingIntegration: (key: string) => {
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            integrations: {
              ...state.onboarding.integrations,
              [key]: !state.onboarding.integrations[key],
            },
          },
        }));
      },

      tickOnboardingCrmCheck: (key: keyof OnboardingState['crmChecklist']) => {
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            crmChecklist: {
              ...state.onboarding.crmChecklist,
              [key]: true,
            },
          },
        }));
      },

      toggleOnboardingCampaignCheck: (key: keyof OnboardingState['campaignChecklist']) => {
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            campaignChecklist: {
              ...state.onboarding.campaignChecklist,
              [key]: !state.onboarding.campaignChecklist[key],
            },
          },
        }));
      },

      finishOnboarding: () => {
        const state = get();
        const account = state.onboarding.account;
        const newId = `ws-${account.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'client'}`;

        const createdWs: ClientWorkspace = {
          id: newId,
          name: account.companyName || 'Sterling Aesthetics',
          industry: account.industry || 'Medical Aesthetics',
          type: 'B2B',
          plan: state.onboarding.plan,
          status: 'active',
          leadsThisMonth: 0,
          emailsSent: 0,
          smsSent: 0,
          postsPublished: 0,
          aiSpend: 0,
          revenue: state.onboarding.plan === 'Scale' ? 799 : state.onboarding.plan === 'Starter' ? 149 : 349,
          margin: 78.5,
          crmStatus: 'connected',
          lastActivity: 'Just now',
          tokenCostPerLead: 0.025,
          tokenCostPerCampaign: 4.2,
          subAccountName: `${account.companyName} GHL Sub-Account`,
          contactsSynced: 0,
          pipelinesMapped: 3,
          dailySpendCap: 25,
          modelSplit: { small: 75, large: 25 },
          conversationsNeedingReply: 0,
        };

        const createdSub: AgencySubscription = {
          id: `sub-${Date.now().toString(36)}`,
          workspaceId: newId,
          customerName: createdWs.name,
          plan: createdWs.plan,
          status: 'active',
          nextInvoice: '2026-11-01',
          amount: createdWs.revenue,
          paymentMethod: 'Visa ending in 4242',
        };

        const createdGhl: GhlSubAccount = {
          id: `ghl-${Date.now().toString(36)}`,
          workspaceId: newId,
          subAccountName: createdWs.subAccountName,
          locationId: `loc_${Date.now().toString(36)}`,
          syncStatus: 'Connected',
          lastSync: 'Just now',
          contactsSynced: 0,
          pipelinesMapped: 3,
          customFieldsCount: 16,
        };

        set({
          clientWorkspaces: [createdWs, ...state.clientWorkspaces],
          agencySubscriptions: [createdSub, ...state.agencySubscriptions],
          ghlSubAccounts: [createdGhl, ...state.ghlSubAccounts],
          currentWorkspaceId: newId,
          appMode: 'client',
        });

        return newId;
      },

      // Core Domain Actions
      addLead: (lead: Lead) => {
        set((state) => ({ leads: [lead, ...state.leads] }));
      },

      updateLeadStage: (id: string, stage: CrmStage) => {
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id
              ? {
                  ...l,
                  stage,
                  timeline: [
                    {
                      id: `evt-${Date.now()}`,
                      date: 'Just now',
                      type: 'stage_changed',
                      title: `Stage moved to ${stage}`,
                      note: 'CRM pipeline stage updated via board interaction.',
                    },
                    ...l.timeline,
                  ],
                }
              : l
          ),
        }));
      },

      updateLead: (id: string, updates: Partial<Lead>) => {
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        }));
      },

      addPlan: (plan: PlannedCampaign) => {
        set((state) => ({ plans: [plan, ...state.plans] }));
      },

      approvePlan: (planId: string) => {
        const state = get();
        const plan = state.plans.find((p) => p.id === planId);
        if (!plan) return;

        const newRun: WorkflowRun = {
          id: `run-${Date.now()}`,
          workspace_id: plan.workspace_id,
          campaignId: plan.id,
          workflowName: plan.audience,
          trigger: 'Manual Approval',
          status: 'running',
          startedAt: 'Just now',
          duration: '0s',
          steps: [
            {
              id: 'st-1',
              name: 'Ingest and Deduplicate Audience',
              status: 'done',
              latency: '420ms',
              outputSummary: `Prepared ${plan.count} contacts from targeting parameters.`,
            },
            {
              id: 'st-2',
              name: 'Enrich and Score Contacts via LLM',
              status: 'running',
              latency: '850ms',
              outputSummary: 'Classifying decision-maker titles and scoring propensity.',
            },
          ],
        };

        set({
          plans: state.plans.map((p) => (p.id === planId ? { ...p, status: 'approved' } : p)),
          runs: [newRun, ...state.runs],
        });
      },

      rejectPlan: (planId: string) => {
        set((state) => ({
          plans: state.plans.map((p) => (p.id === planId ? { ...p, status: 'rejected' } : p)),
        }));
      },

      requestChanges: (planId: string, comment: string) => {
        set((state) => ({
          plans: state.plans.map((p) =>
            p.id === planId
              ? { ...p, status: 'changes_requested', feedbackComment: comment }
              : p
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
                }
              : r
          ),
        }));
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

      testConnection: async (connId: string): Promise<boolean> => {
        await fakeDelay(500);
        set((state) => {
          const currentWsConns = state.connections[state.currentWorkspaceId] || [];
          const updated = currentWsConns.map((c) =>
            c.id === connId ? { ...c, status: 'connected' as const, lastTested: 'Just now' } : c
          );
          return {
            connections: {
              ...state.connections,
              [state.currentWorkspaceId]: updated,
            },
          };
        });
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
        appMode: state.appMode,
        supportSessionWorkspace: state.supportSessionWorkspace,
        currentWorkspaceId: state.currentWorkspaceId,
        currentRole: state.currentRole,
        showDataScope: state.showDataScope,
        darkMode: state.darkMode,
        clientWorkspaces: state.clientWorkspaces,
        planDefinitions: state.planDefinitions,
        pricingAssumptions: state.pricingAssumptions,
        agencySubscriptions: state.agencySubscriptions,
        agencyInvoices: state.agencyInvoices,
        ghlSubAccounts: state.ghlSubAccounts,
        ghlErrors: state.ghlErrors,
        agencyTeam: state.agencyTeam,
        systemWorkflows: state.systemWorkflows,
        clientReports: state.clientReports,
        websiteForms: state.websiteForms,
        onboarding: state.onboarding,
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
