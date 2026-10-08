import {
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
  PlanTier,
} from '../types';

export const DEFAULT_PLANS: PlanDefinition[] = [
  {
    name: 'Starter',
    price: 149,
    leads: 500,
    emails: 2000,
    sms: 200,
    posts: 20,
    seats: 2,
    includedAiSpend: 25,
    description: 'Essential lead generation and multi-channel nurturing for emerging service businesses.',
  },
  {
    name: 'Growth',
    price: 349,
    leads: 3000,
    emails: 15000,
    sms: 1000,
    posts: 60,
    seats: 5,
    includedAiSpend: 75,
    description: 'High-velocity outbound pipelines, Twilio SMS routing, and automated CRM orchestration.',
  },
  {
    name: 'Scale',
    price: 799,
    leads: 10000,
    emails: 50000,
    sms: 4000,
    posts: 200,
    seats: 15,
    includedAiSpend: 200,
    description: 'Enterprise throughput with dedicated IP warmup, multi-seat governance, and custom models.',
  },
];

export const DEFAULT_PRICING_ASSUMPTIONS: PricingAssumptions = {
  avgTokensPerLead: 1850,
  costPer1mSmallModel: 0.15,
  costPer1mLargeModel: 2.50,
  apolloCostPerLead: 0.02,
  emailCostPer1k: 0.80,
  smsCostPerSegment: 0.0079,
};

export const CLIENT_WORKSPACES: ClientWorkspace[] = [
  {
    id: 'halden',
    name: 'Halden Aesthetics',
    industry: 'Medical Aesthetics & Med Spas',
    type: 'B2B',
    plan: 'Growth',
    status: 'active',
    leadsThisMonth: 1420,
    emailsSent: 7120,
    smsSent: 480,
    postsPublished: 38,
    aiSpend: 48.2,
    revenue: 349,
    margin: 78.4,
    crmStatus: 'connected',
    lastActivity: '3m ago',
    tokenCostPerLead: 0.028,
    tokenCostPerCampaign: 4.12,
    subAccountName: 'Halden MedSpa NY',
    contactsSynced: 1420,
    pipelinesMapped: 4,
    dailySpendCap: 25,
    modelSplit: { small: 75, large: 25 },
    conversationsNeedingReply: 3,
  },
  {
    id: 'lakeview',
    name: 'Lakeview Dental Group',
    industry: 'Multi-Location Dental Clinics',
    type: 'B2C',
    plan: 'Growth',
    status: 'active',
    leadsThisMonth: 1890,
    emailsSent: 6400,
    smsSent: 820,
    postsPublished: 44,
    aiSpend: 54.6,
    revenue: 349,
    margin: 74.2,
    crmStatus: 'connected',
    lastActivity: '11m ago',
    tokenCostPerLead: 0.024,
    tokenCostPerCampaign: 3.85,
    subAccountName: 'Lakeview Dental Central',
    contactsSynced: 1890,
    pipelinesMapped: 5,
    dailySpendCap: 30,
    modelSplit: { small: 80, large: 20 },
    conversationsNeedingReply: 5,
  },
  {
    id: 'ridgeway',
    name: 'Ridgeway Roofing',
    industry: 'Commercial & Residential Roofing',
    type: 'mixed',
    plan: 'Starter',
    status: 'active',
    leadsThisMonth: 340,
    emailsSent: 1280,
    smsSent: 110,
    postsPublished: 14,
    aiSpend: 16.4,
    revenue: 149,
    margin: 72.8,
    crmStatus: 'connected',
    lastActivity: '28m ago',
    tokenCostPerLead: 0.032,
    tokenCostPerCampaign: 2.90,
    subAccountName: 'Ridgeway Roofing Midwest',
    contactsSynced: 340,
    pipelinesMapped: 3,
    dailySpendCap: 15,
    modelSplit: { small: 70, large: 30 },
    conversationsNeedingReply: 1,
  },
  {
    id: 'apex-solar',
    name: 'Apex Solar Dynamics',
    industry: 'Residential Clean Energy',
    type: 'B2C',
    plan: 'Scale',
    status: 'active',
    leadsThisMonth: 6420,
    emailsSent: 31800,
    smsSent: 2650,
    postsPublished: 142,
    aiSpend: 138.5,
    revenue: 799,
    margin: 76.5,
    crmStatus: 'connected',
    lastActivity: '7m ago',
    tokenCostPerLead: 0.021,
    tokenCostPerCampaign: 5.60,
    subAccountName: 'Apex Solar Regional',
    contactsSynced: 6420,
    pipelinesMapped: 6,
    dailySpendCap: 60,
    modelSplit: { small: 85, large: 15 },
    conversationsNeedingReply: 8,
  },
  {
    id: 'vanguard-legal',
    name: 'Vanguard Legal Partners',
    industry: 'Corporate & M&A Advisory',
    type: 'B2B',
    plan: 'Scale',
    status: 'active',
    leadsThisMonth: 4180,
    emailsSent: 24600,
    smsSent: 890,
    postsPublished: 110,
    aiSpend: 162.0,
    revenue: 799,
    margin: 73.1,
    crmStatus: 'connected',
    lastActivity: '19m ago',
    tokenCostPerLead: 0.038,
    tokenCostPerCampaign: 6.80,
    subAccountName: 'Vanguard Legal Main',
    contactsSynced: 4180,
    pipelinesMapped: 4,
    dailySpendCap: 50,
    modelSplit: { small: 60, large: 40 },
    conversationsNeedingReply: 2,
  },
  {
    id: 'lumina-skin',
    name: 'Lumina Skin Clinic',
    industry: 'Dermatology & Laser Centers',
    type: 'B2C',
    plan: 'Growth',
    status: 'active',
    leadsThisMonth: 2150,
    emailsSent: 8900,
    smsSent: 740,
    postsPublished: 52,
    aiSpend: 59.8,
    revenue: 349,
    margin: 71.9,
    crmStatus: 'connected',
    lastActivity: '4m ago',
    tokenCostPerLead: 0.026,
    tokenCostPerCampaign: 4.30,
    subAccountName: 'Lumina Skin Centers',
    contactsSynced: 2150,
    pipelinesMapped: 4,
    dailySpendCap: 30,
    modelSplit: { small: 78, large: 22 },
    conversationsNeedingReply: 4,
  },
  {
    id: 'beacon-hvac',
    name: 'Beacon Mechanical HVAC',
    industry: 'Commercial HVAC & Mechanical',
    type: 'mixed',
    plan: 'Growth',
    status: 'active',
    leadsThisMonth: 1650,
    emailsSent: 6800,
    smsSent: 520,
    postsPublished: 36,
    aiSpend: 46.1,
    revenue: 349,
    margin: 77.0,
    crmStatus: 'connected',
    lastActivity: '42m ago',
    tokenCostPerLead: 0.027,
    tokenCostPerCampaign: 3.95,
    subAccountName: 'Beacon HVAC East',
    contactsSynced: 1650,
    pipelinesMapped: 4,
    dailySpendCap: 25,
    modelSplit: { small: 72, large: 28 },
    conversationsNeedingReply: 2,
  },
  {
    id: 'strata-realty',
    name: 'Strata Realty Advisors',
    industry: 'Commercial Real Estate Brokerage',
    type: 'B2B',
    plan: 'Starter',
    status: 'trial',
    leadsThisMonth: 220,
    emailsSent: 840,
    smsSent: 60,
    postsPublished: 12,
    aiSpend: 9.8,
    revenue: 149,
    margin: 81.2,
    crmStatus: 'syncing',
    lastActivity: '1h ago',
    tokenCostPerLead: 0.035,
    tokenCostPerCampaign: 2.40,
    subAccountName: 'Strata Realty Pilot',
    contactsSynced: 220,
    pipelinesMapped: 2,
    dailySpendCap: 15,
    modelSplit: { small: 65, large: 35 },
    conversationsNeedingReply: 0,
  },
  {
    id: 'zenith-fitness',
    name: 'Zenith Fitness Franchises',
    industry: 'Boutique Gyms & Personal Training',
    type: 'B2C',
    plan: 'Scale',
    status: 'active',
    leadsThisMonth: 5820,
    emailsSent: 28400,
    smsSent: 3100,
    postsPublished: 165,
    aiSpend: 124.0,
    revenue: 799,
    margin: 75.8,
    crmStatus: 'connected',
    lastActivity: '14m ago',
    tokenCostPerLead: 0.022,
    tokenCostPerCampaign: 5.10,
    subAccountName: 'Zenith Fitness Group',
    contactsSynced: 5820,
    pipelinesMapped: 5,
    dailySpendCap: 55,
    modelSplit: { small: 82, large: 18 },
    conversationsNeedingReply: 7,
  },
  {
    id: 'summit-wealth',
    name: 'Summit Wealth Management',
    industry: 'Private Client Wealth Management',
    type: 'B2B',
    plan: 'Growth',
    status: 'active',
    leadsThisMonth: 1240,
    emailsSent: 5900,
    smsSent: 340,
    postsPublished: 28,
    aiSpend: 51.4,
    revenue: 349,
    margin: 75.3,
    crmStatus: 'connected',
    lastActivity: '35m ago',
    tokenCostPerLead: 0.039,
    tokenCostPerCampaign: 4.80,
    subAccountName: 'Summit Wealth Advisors',
    contactsSynced: 1240,
    pipelinesMapped: 3,
    dailySpendCap: 30,
    modelSplit: { small: 58, large: 42 },
    conversationsNeedingReply: 1,
  },
  {
    id: 'coastal-dental',
    name: 'Coastal Pediatric Dental',
    industry: 'Pediatric Healthcare Practice',
    type: 'B2C',
    plan: 'Starter',
    status: 'past due',
    leadsThisMonth: 410,
    emailsSent: 1620,
    smsSent: 180,
    postsPublished: 16,
    aiSpend: 18.2,
    revenue: 149,
    margin: 71.0,
    crmStatus: 'error',
    lastActivity: '3h ago',
    tokenCostPerLead: 0.029,
    tokenCostPerCampaign: 3.10,
    subAccountName: 'Coastal Pediatric Clinic',
    contactsSynced: 410,
    pipelinesMapped: 3,
    dailySpendCap: 15,
    modelSplit: { small: 76, large: 24 },
    conversationsNeedingReply: 0,
  },
  {
    id: 'nova-logistics',
    name: 'Nova Freight Logistics',
    industry: 'Intermodal Freight & 3PL',
    type: 'B2B',
    plan: 'Scale',
    status: 'paused',
    leadsThisMonth: 2100,
    emailsSent: 9400,
    smsSent: 420,
    postsPublished: 40,
    aiSpend: 78.4,
    revenue: 799,
    margin: 79.2,
    crmStatus: 'pending',
    lastActivity: '2d ago',
    tokenCostPerLead: 0.036,
    tokenCostPerCampaign: 4.40,
    subAccountName: 'Nova Freight Hub',
    contactsSynced: 2100,
    pipelinesMapped: 4,
    dailySpendCap: 40,
    modelSplit: { small: 68, large: 32 },
    conversationsNeedingReply: 0,
  },
];

export const INITIAL_AGENCY_SUBSCRIPTIONS: AgencySubscription[] = [
  {
    id: 'sub-001',
    workspaceId: 'halden',
    customerName: 'Halden Aesthetics',
    plan: 'Growth',
    status: 'active',
    nextInvoice: '2026-11-01',
    amount: 349,
    paymentMethod: 'Visa ending in 4242',
  },
  {
    id: 'sub-002',
    workspaceId: 'lakeview',
    customerName: 'Lakeview Dental Group',
    plan: 'Growth',
    status: 'active',
    nextInvoice: '2026-11-01',
    amount: 349,
    paymentMethod: 'Mastercard ending in 8812',
  },
  {
    id: 'sub-003',
    workspaceId: 'ridgeway',
    customerName: 'Ridgeway Roofing',
    plan: 'Starter',
    status: 'active',
    nextInvoice: '2026-11-05',
    amount: 149,
    paymentMethod: 'Visa ending in 4242',
  },
  {
    id: 'sub-004',
    workspaceId: 'apex-solar',
    customerName: 'Apex Solar Dynamics',
    plan: 'Scale',
    status: 'active',
    nextInvoice: '2026-11-03',
    amount: 799,
    paymentMethod: 'Amex ending in 1024',
  },
  {
    id: 'sub-005',
    workspaceId: 'vanguard-legal',
    customerName: 'Vanguard Legal Partners',
    plan: 'Scale',
    status: 'active',
    nextInvoice: '2026-11-08',
    amount: 799,
    paymentMethod: 'Visa ending in 4242',
  },
  {
    id: 'sub-006',
    workspaceId: 'lumina-skin',
    customerName: 'Lumina Skin Clinic',
    plan: 'Growth',
    status: 'active',
    nextInvoice: '2026-11-02',
    amount: 349,
    paymentMethod: 'Visa ending in 9140',
  },
  {
    id: 'sub-007',
    workspaceId: 'beacon-hvac',
    customerName: 'Beacon Mechanical HVAC',
    plan: 'Growth',
    status: 'active',
    nextInvoice: '2026-11-04',
    amount: 349,
    paymentMethod: 'Mastercard ending in 5519',
  },
  {
    id: 'sub-008',
    workspaceId: 'strata-realty',
    customerName: 'Strata Realty Advisors',
    plan: 'Starter',
    status: 'trialing',
    nextInvoice: '2026-10-22',
    amount: 149,
    paymentMethod: 'Visa ending in 4242',
  },
  {
    id: 'sub-009',
    workspaceId: 'zenith-fitness',
    customerName: 'Zenith Fitness Franchises',
    plan: 'Scale',
    status: 'active',
    nextInvoice: '2026-11-01',
    amount: 799,
    paymentMethod: 'Amex ending in 3302',
  },
  {
    id: 'sub-010',
    workspaceId: 'summit-wealth',
    customerName: 'Summit Wealth Management',
    plan: 'Growth',
    status: 'active',
    nextInvoice: '2026-11-09',
    amount: 349,
    paymentMethod: 'Visa ending in 4242',
  },
  {
    id: 'sub-011',
    workspaceId: 'coastal-dental',
    customerName: 'Coastal Pediatric Dental',
    plan: 'Starter',
    status: 'past_due',
    nextInvoice: '2026-10-02',
    amount: 149,
    paymentMethod: 'Visa ending in 7014',
  },
  {
    id: 'sub-012',
    workspaceId: 'nova-logistics',
    customerName: 'Nova Freight Logistics',
    plan: 'Scale',
    status: 'active',
    nextInvoice: '2026-11-12',
    amount: 799,
    paymentMethod: 'Mastercard ending in 6620',
  },
];

export const INITIAL_AGENCY_INVOICES: AgencyInvoice[] = [
  { id: 'INV-2026-1048', workspaceId: 'halden', workspaceName: 'Halden Aesthetics', amount: 349, date: '2026-10-01', status: 'Paid', method: 'Visa •••• 4242' },
  { id: 'INV-2026-1047', workspaceId: 'lakeview', workspaceName: 'Lakeview Dental Group', amount: 349, date: '2026-10-01', status: 'Paid', method: 'Mastercard •••• 8812' },
  { id: 'INV-2026-1046', workspaceId: 'zenith-fitness', workspaceName: 'Zenith Fitness Franchises', amount: 799, date: '2026-10-01', status: 'Paid', method: 'Amex •••• 3302' },
  { id: 'INV-2026-1045', workspaceId: 'apex-solar', workspaceName: 'Apex Solar Dynamics', amount: 799, date: '2026-10-03', status: 'Paid', method: 'Amex •••• 1024' },
  { id: 'INV-2026-1044', workspaceId: 'coastal-dental', workspaceName: 'Coastal Pediatric Dental', amount: 149, date: '2026-10-02', status: 'Failed', method: 'Visa •••• 7014' },
  { id: 'INV-2026-1043', workspaceId: 'ridgeway', workspaceName: 'Ridgeway Roofing', amount: 149, date: '2026-09-05', status: 'Paid', method: 'Visa •••• 4242' },
];

export const INITIAL_GHL_SUBACCOUNTS: GhlSubAccount[] = [
  { id: 'ghl-01', workspaceId: 'halden', subAccountName: 'Halden MedSpa NY', locationId: 'loc_hd982n1a', syncStatus: 'Connected', lastSync: '2m ago', contactsSynced: 1420, pipelinesMapped: 4, customFieldsCount: 18 },
  { id: 'ghl-02', workspaceId: 'lakeview', subAccountName: 'Lakeview Dental Central', locationId: 'loc_lv441k9z', syncStatus: 'Connected', lastSync: '8m ago', contactsSynced: 1890, pipelinesMapped: 5, customFieldsCount: 22 },
  { id: 'ghl-03', workspaceId: 'ridgeway', subAccountName: 'Ridgeway Roofing Midwest', locationId: 'loc_rw109b3c', syncStatus: 'Connected', lastSync: '14m ago', contactsSynced: 340, pipelinesMapped: 3, customFieldsCount: 12 },
  { id: 'ghl-04', workspaceId: 'apex-solar', subAccountName: 'Apex Solar Regional', locationId: 'loc_ap772x0q', syncStatus: 'Connected', lastSync: '5m ago', contactsSynced: 6420, pipelinesMapped: 6, customFieldsCount: 26 },
  { id: 'ghl-05', workspaceId: 'vanguard-legal', subAccountName: 'Vanguard Legal Main', locationId: 'loc_vg550m2k', syncStatus: 'Connected', lastSync: '18m ago', contactsSynced: 4180, pipelinesMapped: 4, customFieldsCount: 20 },
  { id: 'ghl-06', workspaceId: 'lumina-skin', subAccountName: 'Lumina Skin Centers', locationId: 'loc_lm338p7w', syncStatus: 'Connected', lastSync: '3m ago', contactsSynced: 2150, pipelinesMapped: 4, customFieldsCount: 19 },
  { id: 'ghl-07', workspaceId: 'beacon-hvac', subAccountName: 'Beacon HVAC East', locationId: 'loc_bc881s4v', syncStatus: 'Connected', lastSync: '32m ago', contactsSynced: 1650, pipelinesMapped: 4, customFieldsCount: 15 },
  { id: 'ghl-08', workspaceId: 'strata-realty', subAccountName: 'Strata Realty Pilot', locationId: 'loc_st119j6d', syncStatus: 'Syncing', lastSync: 'Just now', contactsSynced: 220, pipelinesMapped: 2, customFieldsCount: 10 },
  { id: 'ghl-09', workspaceId: 'zenith-fitness', subAccountName: 'Zenith Fitness Group', locationId: 'loc_zn664h8r', syncStatus: 'Connected', lastSync: '10m ago', contactsSynced: 5820, pipelinesMapped: 5, customFieldsCount: 24 },
  { id: 'ghl-10', workspaceId: 'summit-wealth', subAccountName: 'Summit Wealth Advisors', locationId: 'loc_sm225t1y', syncStatus: 'Connected', lastSync: '25m ago', contactsSynced: 1240, pipelinesMapped: 3, customFieldsCount: 16 },
  { id: 'ghl-11', workspaceId: 'coastal-dental', subAccountName: 'Coastal Pediatric Clinic', locationId: 'loc_cp993u5f', syncStatus: 'Error', lastSync: '2h ago', contactsSynced: 410, pipelinesMapped: 3, customFieldsCount: 14 },
  { id: 'ghl-12', workspaceId: 'nova-logistics', subAccountName: 'Nova Freight Hub', locationId: 'loc_nv440e7g', syncStatus: 'Connected', lastSync: '1d ago', contactsSynced: 2100, pipelinesMapped: 4, customFieldsCount: 18 },
];

export const INITIAL_GHL_ERRORS: GhlError[] = [
  {
    id: 'err-01',
    workspaceName: 'Coastal Pediatric Clinic',
    errorCode: 'GHL_RATE_LIMIT_429',
    message: 'Sub-account webhook listener throttled during batch contact synchronization.',
    timestamp: '2h ago',
  },
  {
    id: 'err-02',
    workspaceName: 'Ridgeway Roofing Midwest',
    errorCode: 'INVALID_E164_PHONE',
    message: 'Recipient contact phone formatting rejected by Twilio sub-account gateway.',
    timestamp: '5h ago',
  },
  {
    id: 'err-03',
    workspaceName: 'Nova Freight Hub',
    errorCode: 'PIPELINE_STAGE_NOT_FOUND',
    message: 'Target stage identifier "Dispatched" was deleted in GoHighLevel dashboard.',
    timestamp: '1d ago',
  },
];

export const INITIAL_AGENCY_TEAM: AgencyTeamMember[] = [
  { id: 'ag-01', name: 'Alexander Wright', email: 'alex@northstarmarketing.io', role: 'super_admin', lastActive: 'Active now' },
  { id: 'ag-02', name: 'Elena Rostova', email: 'elena@northstarmarketing.io', role: 'support', lastActive: '12m ago' },
  { id: 'ag-03', name: 'Marcus Chen', email: 'marcus@northstarmarketing.io', role: 'support', lastActive: '1h ago' },
  { id: 'ag-04', name: 'Sarah Jenkins', email: 'sarah.j@northstarmarketing.io', role: 'billing', lastActive: '4h ago' },
];

export const INITIAL_SYSTEM_WORKFLOWS: SystemWorkflowHealth[] = [
  { id: 'wf-01', name: 'B2B Apollo Ingestion Pipeline', status: 'healthy', executions24h: 12480, errorRate: 0.05, avgDurationMs: 420 },
  { id: 'wf-02', name: 'B2C Webhook & Ad Capture Engine', status: 'healthy', executions24h: 8940, errorRate: 0.02, avgDurationMs: 310 },
  { id: 'wf-03', name: 'AI Sentiment Classifier & Reply Gate', status: 'healthy', executions24h: 3150, errorRate: 0.10, avgDurationMs: 650 },
  { id: 'wf-04', name: 'Twilio 10DLC SMS Dispatcher', status: 'healthy', executions24h: 4200, errorRate: 0.08, avgDurationMs: 280 },
  { id: 'wf-05', name: 'GoHighLevel Bi-Directional Syncer', status: 'degraded', executions24h: 18200, errorRate: 0.45, avgDurationMs: 820 },
  { id: 'wf-06', name: 'Hourly Metric Aggregator & Guardrails', status: 'healthy', executions24h: 720, errorRate: 0.00, avgDurationMs: 190 },
];

export const INITIAL_CLIENT_REPORTS: ClientReport[] = [
  { id: 'rep-01', workspaceId: 'halden', title: 'Weekly Multi-Channel Outreach Digest', type: 'Weekly', period: 'Oct 1 - Oct 7, 2026', leadsGenerated: 324, repliesReceived: 42, spend: 11.8, roi: '4.8x', status: 'Ready' },
  { id: 'rep-02', workspaceId: 'halden', title: 'Monthly Conversion & Pipeline Dossier', type: 'Monthly', period: 'September 2026', leadsGenerated: 1290, repliesReceived: 188, spend: 48.2, roi: '5.2x', status: 'Ready' },
  { id: 'rep-03', workspaceId: 'halden', title: 'B2B Lead Scoring & Verification Summary', type: 'Monthly', period: 'September 2026', leadsGenerated: 1290, repliesReceived: 188, spend: 28.5, roi: '4.6x', status: 'Ready' },
  { id: 'rep-04', workspaceId: 'lakeview', title: 'Weekly Patient Inbound & SMS Follow-up', type: 'Weekly', period: 'Oct 1 - Oct 7, 2026', leadsGenerated: 412, repliesReceived: 98, spend: 14.2, roi: '6.1x', status: 'Ready' },
  { id: 'rep-05', workspaceId: 'ridgeway', title: 'Commercial Estimating Pipeline Report', type: 'Weekly', period: 'Oct 1 - Oct 7, 2026', leadsGenerated: 85, repliesReceived: 14, spend: 4.1, roi: '3.9x', status: 'Ready' },
];

export const INITIAL_WEBSITE_FORMS: WebsiteInboundForm[] = [
  { id: 'form-01', workspaceId: 'halden', name: 'Free Consultation Booking Form', endpointUrl: 'https://api.platform.internal/v1/inbound/halden/booking', submissionsCount: 482, conversionRate: '4.2%', lastSubmission: '14m ago', status: 'active' },
  { id: 'form-02', workspaceId: 'halden', name: 'Provider Partnership Inquiry Modal', endpointUrl: 'https://api.platform.internal/v1/inbound/halden/partner', submissionsCount: 128, conversionRate: '2.8%', lastSubmission: '2h ago', status: 'active' },
  { id: 'form-03', workspaceId: 'halden', name: 'VIP Treatment Waitlist', endpointUrl: 'https://api.platform.internal/v1/inbound/halden/waitlist', submissionsCount: 614, conversionRate: '6.5%', lastSubmission: '45m ago', status: 'active' },
];

export const INITIAL_ISOLATION_CHECKS: IsolationAuditCheck[] = [
  { id: 1, name: 'Cross-Tenant Direct SQL Read', targetTable: 'public.leads', attemptedAction: 'SELECT * FROM leads WHERE workspace_id != current_setting(...)', rowsReturned: 0, status: 'PASS', enforcementRule: 'PostgreSQL RLS policy tenant_isolation enforced' },
  { id: 2, name: 'Cross-Tenant Campaign Mutation', targetTable: 'public.campaigns', attemptedAction: 'UPDATE campaigns SET status = "paused" WHERE workspace_id = "vanguard-legal"', rowsReturned: 0, status: 'PASS', enforcementRule: 'RLS update policy denies foreign workspace keys' },
  { id: 3, name: 'Unauthenticated Query Without Scope', targetTable: 'public.messages', attemptedAction: 'SELECT count(*) FROM messages WITHOUT session header', rowsReturned: 0, status: 'PASS', enforcementRule: 'Default deny policy returns 0 rows' },
  { id: 4, name: 'Outbound Webhook Cross-Dispatch', targetTable: 'public.integrations', attemptedAction: 'TRIGGER webhook ON FOREIGN workspace_id', rowsReturned: 0, status: 'PASS', enforcementRule: 'Tenant queue partition isolates webhook jobs' },
  { id: 5, name: 'Secret Decryption Across Workspaces', targetTable: 'vault.decrypted_secrets', attemptedAction: 'SELECT pgp_sym_decrypt(key, ...) FROM foreign_vault', rowsReturned: 0, status: 'PASS', enforcementRule: 'KMS per-tenant envelope encryption key mismatch' },
  { id: 6, name: 'CRM Access Token Cross-Lookup', targetTable: 'public.crm_sync', attemptedAction: 'SELECT access_token FROM crm_sync WHERE workspace_id != me', rowsReturned: 0, status: 'PASS', enforcementRule: 'RLS row filter eliminates foreign credentials' },
  { id: 7, name: 'Audit Log Trail Cross-Read', targetTable: 'public.audit_logs', attemptedAction: 'SELECT * FROM audit_logs WHERE actor_workspace != me', rowsReturned: 0, status: 'PASS', enforcementRule: 'Append-only partitioned audit ledger' },
  { id: 8, name: 'Storage Bucket Folder Traversal', targetTable: 'storage.objects', attemptedAction: 'GET /storage/v1/b/tenants/o/foreign-workspace-id/exports.csv', rowsReturned: 0, status: 'PASS', enforcementRule: 'Storage policy path prefix matches current_workspace_id' },
];

/**
 * Deterministic helper to compute tier financial economics based on assumptions
 */
export function calculateTierForecast(
  clientCount: number,
  plans: PlanDefinition[],
  assumptions: PricingAssumptions
) {
  // Assume realistic client distribution: 40% Starter, 45% Growth, 15% Scale
  const starterCount = Math.round(clientCount * 0.40);
  const growthCount = Math.round(clientCount * 0.45);
  const scaleCount = clientCount - starterCount - growthCount;

  const starterPlan = plans.find((p) => p.name === 'Starter') || DEFAULT_PLANS[0];
  const growthPlan = plans.find((p) => p.name === 'Growth') || DEFAULT_PLANS[1];
  const scalePlan = plans.find((p) => p.name === 'Scale') || DEFAULT_PLANS[2];

  const monthlyRevenue =
    starterCount * starterPlan.price +
    growthCount * growthPlan.price +
    scaleCount * scalePlan.price;

  // Compute unit costs per client tier
  const computeClientCost = (plan: PlanDefinition) => {
    // 1. AI tokens: 70% small model, 30% large model
    const totalTokens = plan.leads * assumptions.avgTokensPerLead;
    const smallTokens = totalTokens * 0.70;
    const largeTokens = totalTokens * 0.30;
    const aiCost =
      (smallTokens / 1_000_000) * assumptions.costPer1mSmallModel +
      (largeTokens / 1_000_000) * assumptions.costPer1mLargeModel;

    // 2. Apollo lead verification cost
    const apolloCost = plan.leads * assumptions.apolloCostPerLead;

    // 3. Email sending cost
    const emailCost = (plan.emails / 1000) * assumptions.emailCostPer1k;

    // 4. SMS cost
    const smsCost = plan.sms * assumptions.smsCostPerSegment;

    // 5. Fixed platform infrastructure allocation per tenant ($12/tenant)
    const platformCost = 12.0;

    return aiCost + apolloCost + emailCost + smsCost + platformCost;
  };

  const starterCostPerClient = computeClientCost(starterPlan);
  const growthCostPerClient = computeClientCost(growthPlan);
  const scaleCostPerClient = computeClientCost(scalePlan);

  const totalCost =
    starterCount * starterCostPerClient +
    growthCount * growthCostPerClient +
    scaleCount * scaleCostPerClient;

  const grossMarginDollars = monthlyRevenue - totalCost;
  const grossMarginPercent = monthlyRevenue > 0 ? (grossMarginDollars / monthlyRevenue) * 100 : 0;

  return {
    clientCount,
    starterCount,
    growthCount,
    scaleCount,
    monthlyRevenue: Math.round(monthlyRevenue),
    totalCost: Math.round(totalCost),
    grossMarginDollars: Math.round(grossMarginDollars),
    grossMarginPercent: Number(grossMarginPercent.toFixed(1)),
    starterCostPerClient: Number(starterCostPerClient.toFixed(2)),
    growthCostPerClient: Number(growthCostPerClient.toFixed(2)),
    scaleCostPerClient: Number(scaleCostPerClient.toFixed(2)),
  };
}
