export type WorkspaceId = 'halden' | 'lakeview' | 'ridgeway';
export type UserRole = 'owner' | 'admin' | 'operator' | 'viewer';

export interface WorkspaceLimits {
  leads: { used: number; max: number };
  emails: { used: number; max: number };
  sms: { used: number; max: number };
  aiSpend: { used: number; max: number }; // dollars
}

export interface Workspace {
  id: WorkspaceId;
  name: string;
  industry: string;
  focus: string;
  tier: 'Growth' | 'Professional' | 'Enterprise';
  timezone: string;
  sendingHours: string;
  retentionDays: number;
  limits: WorkspaceLimits;
}

export interface ConnectionConfig {
  id: string;
  workspace_id: WorkspaceId;
  name: string;
  category: 'llm' | 'email' | 'sms' | 'lead_data' | 'verification' | 'crm' | 'social' | 'alerts';
  provider: string;
  apiKeyMasked: string;
  status: 'connected' | 'testing' | 'error' | 'pending_review';
  lastTested: string;
  details?: string;
}

export interface LeadTimelineEvent {
  id: string;
  date: string;
  type: 'form_submit' | 'verified' | 'email_sent' | 'sms_sent' | 'reply_received' | 'stage_changed' | 'ai_analyzed' | 'crm_synced';
  title: string;
  note: string;
}

export type CrmStage = 'Lead' | 'Contacted' | 'Engaged' | 'Qualified' | 'Appointment' | 'Opportunity' | 'Customer';

export interface Lead {
  id: string;
  workspace_id: WorkspaceId;
  fullName: string;
  email: string;
  phone: string;
  title: string;
  company: string;
  location: string;
  source: 'apollo_b2b' | 'meta_ad' | 'web_form' | 'csv_import' | 'inbound_social';
  stage: CrmStage;
  score: number;
  scoreReason: string;
  consent: {
    status: 'opted_in' | 'pending' | 'unsubscribed';
    date: string;
    source: string;
  };
  tags: string[];
  timeline: LeadTimelineEvent[];
  campaignId?: string;
  notes?: string;
  updatedAt: string;
}

export interface PlannedCampaign {
  id: string;
  workspace_id: WorkspaceId;
  prompt: string;
  audience: string;
  titles: string[];
  location: string;
  count: number;
  channels: ('email' | 'sms' | 'linkedin')[];
  sequenceSteps: {
    step: number;
    channel: string;
    delay: string;
    description: string;
  }[];
  estimatedCost: number;
  estimatedTime: string;
  sampleMessages: {
    channel: string;
    subject?: string;
    body: string;
  }[];
  status: 'pending_approval' | 'approved' | 'changes_requested' | 'rejected';
  feedbackComment?: string;
  createdAt: string;
  targetSpendCap: number;
  dailySendLimit: number;
}

export interface WorkflowRunStep {
  id: string;
  name: string;
  status: 'done' | 'running' | 'failed' | 'waiting';
  latency: string;
  outputSummary?: string;
}

export interface WorkflowRun {
  id: string;
  workspace_id: WorkspaceId;
  workflowName: string;
  trigger: string;
  status: 'running' | 'success' | 'retried' | 'failed' | 'paused_by_rule';
  startedAt: string;
  duration: string;
  campaignId: string;
  steps: WorkflowRunStep[];
  error?: string;
  isDeadLetter?: boolean;
}

export interface CodeRule {
  id: string;
  workspace_id: WorkspaceId;
  code: string;
  name: string;
  description: string;
  value: string | number | boolean;
  unit?: string;
  type: 'toggle' | 'number' | 'text';
  enabled: boolean;
  enforcedInCode: true;
}

export interface RuleDecisionLog {
  id: string;
  workspace_id: WorkspaceId;
  timestamp: string;
  ruleCode: string;
  ruleName: string;
  target: string;
  action: 'allowed' | 'blocked';
  reason: string;
}

export interface EmailSequenceStep {
  step: number;
  dayOffset: number;
  type: 'email';
  subject: string;
  body: string;
  aiPersonalization: boolean;
  samplePersonalized?: string;
}

export interface EmailSequence {
  id: string;
  workspace_id: WorkspaceId;
  name: string;
  status: 'active' | 'draft' | 'paused';
  steps: EmailSequenceStep[];
  sentCount: number;
  openRate: number;
  replyRate: number;
  bounceRate: number;
}

export interface EmailSenderInbox {
  id: string;
  workspace_id: WorkspaceId;
  email: string;
  domain: string;
  spf: 'pass' | 'fail';
  dkim: 'pass' | 'fail';
  dmarc: 'pass' | 'fail';
  warmupProgress: number; // 0 - 100
  dailyLimit: number;
  sentToday: number;
  status: 'active' | 'warming' | 'paused';
}

export interface ReplyItem {
  id: string;
  workspace_id: WorkspaceId;
  leadId?: string;
  leadName: string;
  fromEmail: string;
  subject: string;
  body: string;
  sentiment: 'positive' | 'neutral' | 'not now' | 'unsubscribe' | 'out of office' | 'bounce';
  receivedAt: string;
  campaignName: string;
  handled: boolean;
}

export interface SmsRecord {
  id: string;
  workspace_id: WorkspaceId;
  leadName: string;
  phone: string;
  direction: 'inbound' | 'outbound';
  message: string;
  timestamp: string;
  status: 'delivered' | 'received' | 'failed' | 'opt_out';
}

export interface SocialPost {
  id: string;
  workspace_id: WorkspaceId;
  platform: 'instagram' | 'facebook' | 'linkedin';
  caption: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string;
  status: 'draft' | 'pending_approval' | 'scheduled' | 'published';
  imagePlaceholder?: string;
  metrics?: { impressions: number; clicks: number; engagementRate: string };
}

export interface FollowUpRule {
  id: string;
  workspace_id: WorkspaceId;
  event: 'no_response_48h' | 'positive_reply' | 'appointment_booked' | 'opt_out' | 'became_customer';
  eventLabel: string;
  action: string;
  channel: 'email' | 'sms' | 'crm' | 'slack';
  enabled: boolean;
}

export interface SuppressionRecord {
  id: string;
  workspace_id: WorkspaceId;
  type: 'email' | 'phone' | 'domain';
  value: string;
  reason: 'user_opt_out' | 'hard_bounce' | 'complaint' | 'manual_suppression';
  source: string;
  addedAt: string;
}

export interface SystemLogEntry {
  id: string;
  workspace_id: WorkspaceId;
  type: 'ai_action' | 'workflow' | 'audit';
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface TeamMember {
  id: string;
  workspace_id: WorkspaceId;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  lastActive: string;
}

export interface CrmTask {
  id: string;
  workspace_id: WorkspaceId;
  title: string;
  dueDate: string;
  leadName: string;
  leadCompany: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}
