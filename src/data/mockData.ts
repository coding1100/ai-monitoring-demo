import {
  Workspace,
  WorkspaceId,
  ConnectionConfig,
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
} from '../types';
import { SeededPRNG } from '../utils/seededRandom';

export const WORKSPACES: Workspace[] = [
  {
    id: 'halden',
    name: 'Halden Aesthetics',
    industry: 'Medical Aesthetics & Med Spas',
    focus: 'B2B Provider Outreach & Device Partnerships',
    tier: 'Growth',
    timezone: 'America/New_York (EST)',
    sendingHours: '09:00 - 17:00 EST',
    retentionDays: 90,
    limits: {
      leads: { used: 124, max: 500 },
      emails: { used: 2480, max: 10000 },
      sms: { used: 180, max: 1000 },
      aiSpend: { used: 68.4, max: 250 },
    },
  },
  {
    id: 'lakeview',
    name: 'Lakeview Dental Group',
    industry: 'Multi-Location Dental Clinics',
    focus: 'B2C Patient Inbound Capture & SMS Reminders',
    tier: 'Professional',
    timezone: 'America/Chicago (CST)',
    sendingHours: '08:30 - 18:00 CST',
    retentionDays: 60,
    limits: {
      leads: { used: 148, max: 500 },
      emails: { used: 920, max: 5000 },
      sms: { used: 1340, max: 3000 },
      aiSpend: { used: 42.2, max: 200 },
    },
  },
  {
    id: 'ridgeway',
    name: 'Ridgeway Roofing',
    industry: 'Commercial & Residential Roofing',
    focus: 'Mixed B2B Commercial & Inbound Storm Inquiries',
    tier: 'Growth',
    timezone: 'America/Denver (MST)',
    sendingHours: '08:00 - 17:30 MST',
    retentionDays: 90,
    limits: {
      leads: { used: 92, max: 500 },
      emails: { used: 1140, max: 5000 },
      sms: { used: 590, max: 2000 },
      aiSpend: { used: 31.8, max: 150 },
    },
  },
];

// Helper to seed realistic leads per workspace
export const generateWorkspaceLeads = (workspaceId: WorkspaceId): Lead[] => {
  const prng = new SeededPRNG(`leads_${workspaceId}_2026`);

  const firstNames = ['Marcus', 'Elena', 'Julian', 'Sophia', 'David', 'Chloe', 'Arthur', 'Hannah', 'Gideon', 'Sienna', 'Trevor', 'Nora', 'Vance', 'Lila', 'Dominic', 'Claire', 'Wyatt', 'Camilla', 'Derek', 'Tessa'];
  const lastNames = ['Vance', 'Mercer', 'Castillo', 'Lindqvist', 'Sterling', 'Chen', 'Bauer', 'Novak', 'Gallagher', 'Reyes', 'Holden', 'Sinclair', 'Davenport', 'Kovacs', 'Patel', 'Fischer', 'Watanabe', 'O\'Connor', 'Holt', 'Bishop'];

  interface WorkspaceProfile {
    count: number;
    titles: string[];
    companies: string[];
    locations: string[];
    primarySource: Lead['source'];
    tagPool: string[];
  }

  const workspaceProfiles: Record<string, WorkspaceProfile> = {
    halden: {
      count: 124,
      titles: ['Clinic Owner', 'Medical Director', 'Managing Partner', 'Lead Dermatologist', 'Practice Administrator'],
      companies: ['Radiance Skin Institute', 'Manhattan Derma Lounge', 'Tribeca Med Spa', 'Park Ave Aesthetics', 'Gotham Laser Center', 'Empire Wellness Group', 'Aura Cosmetic Care', 'SoHo Skin Lab', 'Hudson Valley Laser', 'Verve Medical Spa'],
      locations: ['New York, NY', 'Brooklyn, NY', 'White Plains, NY', 'Garden City, NY', 'Jersey City, NJ'],
      primarySource: 'apollo_b2b',
      tagPool: ['medspa_owner', 'laser_qualified', 'nyc_metro', 'q1_target', 'high_ticket'],
    },
    lakeview: {
      count: 148,
      titles: ['Patient', 'Prospective Patient', 'Family Contact', 'Inquirer', 'Member'],
      companies: ['Self (Consumer)', 'Household Lead', 'Individual Inquirer', 'Family Dental Account'],
      locations: ['Chicago, IL', 'Naperville, IL', 'Evanston, IL', 'Schaumburg, IL', 'Oak Park, IL'],
      primarySource: 'web_form',
      tagPool: ['invisalign_inquiry', 'emergency_dental', 'family_cleaning', 'insurance_verified', 'sms_optin'],
    },
    ridgeway: {
      count: 92,
      titles: ['Facility Manager', 'Property Owner', 'Asset Director', 'General Contractor', 'HOA Board Member'],
      companies: ['Apex Industrial Park', 'Summit Commercial Properties', 'Front Range Logistics', 'Pike Peak Warehouse', 'Mile High Storage LLC', 'Continental Property Mgmt', 'Ironclad Industrial'],
      locations: ['Denver, CO', 'Aurora, CO', 'Lakewood, CO', 'Boulder, CO', 'Colorado Springs, CO'],
      primarySource: 'meta_ad',
      tagPool: ['commercial_flat_roof', 'hail_inspection', 'commercial_b2b', 'tpo_membrane', 'insurance_claim'],
    },
  };

  const profile: WorkspaceProfile = workspaceProfiles[workspaceId] || workspaceProfiles.halden;
  const stages: CrmStage[] = ['Lead', 'Contacted', 'Engaged', 'Qualified', 'Appointment', 'Opportunity', 'Customer'];
  const leads: Lead[] = [];

  for (let i = 0; i < profile.count; i++) {
    const fn = prng.pick(firstNames);
    const ln = prng.pick(lastNames);
    const fullName = `${fn} ${ln}`;
    const company = prng.pick(profile.companies);
    const cleanCompany = company.toLowerCase().replace(/[^a-z0-9]/g, '');
    const emailDomain = workspaceId === 'lakeview' ? prng.pick(['gmail.com', 'yahoo.com', 'icloud.com', 'outlook.com']) : `${cleanCompany.slice(0, 10)}.com`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@${emailDomain}`;
    const phone = `+1 (${prng.nextInt(201, 899)}) ${prng.nextInt(200, 999)}-${prng.nextInt(1000, 9999)}`;
    const title = prng.pick(profile.titles);
    const location = prng.pick(profile.locations);

    // Realistic source distribution
    let source: Lead['source'] = profile.primarySource;
    const rSrc = prng.next();
    if (rSrc > 0.8) source = 'meta_ad';
    else if (rSrc > 0.65) source = 'web_form';
    else if (rSrc > 0.55) source = 'csv_import';
    else if (rSrc > 0.50) source = 'inbound_social';

    // Realistic stage distribution
    let stage: CrmStage = 'Lead';
    const rStage = prng.next();
    if (rStage > 0.90) stage = 'Customer';
    else if (rStage > 0.80) stage = 'Opportunity';
    else if (rStage > 0.68) stage = 'Appointment';
    else if (rStage > 0.50) stage = 'Qualified';
    else if (rStage > 0.32) stage = 'Engaged';
    else if (rStage > 0.16) stage = 'Contacted';
    else stage = 'Lead';

    // Deliberate test failure/special case: 1 lead on suppression list for Halden
    let consentStatus: Lead['consent']['status'] = 'opted_in';
    if (i === 12 && workspaceId === 'halden') {
      consentStatus = 'unsubscribed';
    } else if (i === 25) {
      consentStatus = 'pending';
    }

    const score = prng.nextInt(45, 98);
    const scoreReasons = [
      'High domain authority with 4 verified aesthetic laser certifications',
      'Target title match with active New York commercial medical license',
      'Recent high-intent form submission with valid insurance & SMS consent',
      'Over 20k sq ft commercial facility with verified roof inspection need',
      'High engagement: 3 email opens and link click on pricing page',
      'Strong fit based on Yelp rating > 4.5 and multi-provider roster',
    ];

    const tags = prng.pickMultiple(profile.tagPool, prng.nextInt(1, 3));

    const timeline: Lead['timeline'] = [
      {
        id: `tl_${i}_1`,
        date: '2026-03-24 09:15',
        type: source === 'apollo_b2b' ? 'form_submit' : 'form_submit',
        title: `Ingested via ${source.replace('_', ' ')}`,
        note: `Contact captured from verified data pipeline with scope ${workspaceId}.`,
      },
      {
        id: `tl_${i}_2`,
        date: '2026-03-24 09:18',
        type: 'verified',
        title: 'Email and phone verified',
        note: 'SMTP handshake confirmed deliverable. ZeroBounce score 98/100.',
      },
      {
        id: `tl_${i}_3`,
        date: '2026-03-25 11:30',
        type: 'ai_analyzed',
        title: 'AI Personalization Hook Generated',
        note: `Model tiered hook scored relevance at ${score}/100.`,
      },
    ];

    if (stage !== 'Lead') {
      timeline.push({
        id: `tl_${i}_4`,
        date: '2026-03-26 14:02',
        type: 'email_sent',
        title: 'Step 1 Email Delivered',
        note: 'Subject: Question regarding your NYC medical director workflow',
      });
    }

    if (['Engaged', 'Qualified', 'Appointment', 'Opportunity', 'Customer'].includes(stage)) {
      timeline.push({
        id: `tl_${i}_5`,
        date: '2026-03-27 10:45',
        type: 'reply_received',
        title: 'Positive reply classified',
        note: 'Prospect replied asking for pricing sheet & appointment availability.',
      });
      timeline.push({
        id: `tl_${i}_6`,
        date: '2026-03-27 10:46',
        type: 'stage_changed',
        title: `Stage automatically moved to ${stage}`,
        note: 'Follow-up engine rule triggered CRM update.',
      });
    }

    leads.push({
      id: `lead_${workspaceId}_${String(i + 1).padStart(3, '0')}`,
      workspace_id: workspaceId,
      fullName,
      email,
      phone,
      title,
      company,
      location,
      source,
      stage,
      score,
      scoreReason: prng.pick(scoreReasons),
      consent: {
        status: consentStatus,
        date: '2026-03-20',
        source: source === 'web_form' ? 'Website Form Consent v2' : 'Apollo Direct B2B Match',
      },
      tags,
      timeline,
      campaignId: `cmp_${workspaceId}_01`,
      notes: `Account rep notes: Verified operational owner in ${location}.`,
      updatedAt: '2026-03-28 14:10',
    });
  }

  return leads;
};

// Initial Connections Config
export const INITIAL_CONNECTIONS: Record<WorkspaceId, ConnectionConfig[]> = {
  halden: [
    {
      id: 'conn_llm',
      workspace_id: 'halden',
      name: 'OpenAI API',
      category: 'llm',
      provider: 'OpenAI GPT-4o / GPT-4o-mini',
      apiKeyMasked: 'sk-proj-halden••••••••••••94fA',
      status: 'connected',
      lastTested: '2026-03-28 09:30',
      details: 'Latency 412ms, 200 OK. Routing: mini for classification, 4o for personalization.',
    },
    {
      id: 'conn_email',
      workspace_id: 'halden',
      name: 'Instantly Email API',
      category: 'email',
      provider: 'Instantly v2 REST',
      apiKeyMasked: 'inst_live_••••••••••••83b2',
      status: 'connected',
      lastTested: '2026-03-28 09:30',
      details: '4 verified sending inboxes active. SPF/DKIM valid.',
    },
    {
      id: 'conn_sms',
      workspace_id: 'halden',
      name: 'Twilio SMS',
      category: 'sms',
      provider: 'Twilio Messaging Service',
      apiKeyMasked: 'AC39f0••••••••••••e01c',
      status: 'connected',
      lastTested: '2026-03-27 16:45',
      details: 'A2P 10DLC Campaign ID: CP88290 (Approved).',
    },
    {
      id: 'conn_apollo',
      workspace_id: 'halden',
      name: 'Apollo Lead Enrichment',
      category: 'lead_data',
      provider: 'Apollo.io Enterprise API',
      apiKeyMasked: 'apo_key_••••••••••••77a1',
      status: 'connected',
      lastTested: '2026-03-28 08:15',
      details: 'B2B filters: Med Spa, Dermatology, Clinic Owner.',
    },
    {
      id: 'conn_verify',
      workspace_id: 'halden',
      name: 'Email Verification Service',
      category: 'verification',
      provider: 'ZeroBounce API',
      apiKeyMasked: 'zb_live_••••••••••••44cc',
      status: 'connected',
      lastTested: '2026-03-28 08:15',
      details: 'Real-time catch-all & MX check active. 99.4% accuracy.',
    },
    {
      id: 'conn_crm',
      workspace_id: 'halden',
      name: 'HubSpot CRM',
      category: 'crm',
      provider: 'HubSpot Private App OAuth',
      apiKeyMasked: 'pat-na1-••••••••••••09d1',
      status: 'connected',
      lastTested: '2026-03-28 09:20',
      details: 'Bidirectional sync active. 124 contacts mapped.',
    },
    {
      id: 'conn_meta',
      workspace_id: 'halden',
      name: 'Meta Lead Ads',
      category: 'social',
      provider: 'Meta Graph API v19',
      apiKeyMasked: 'EAABw••••••••••••55za',
      status: 'pending_review',
      lastTested: '2026-03-26 12:00',
      details: 'App review pending. Webhook fallback receiver active.',
    },
    {
      id: 'conn_alerts',
      workspace_id: 'halden',
      name: 'Alerts & Webhooks',
      category: 'alerts',
      provider: 'Slack Webhook & Ops Email',
      apiKeyMasked: 'hooks.slack.com/services/••••••••••••',
      status: 'connected',
      lastTested: '2026-03-28 09:00',
      details: 'Channel: #halden-ops-alerts. Bounce threshold notifications enabled.',
    },
  ],
  lakeview: [
    {
      id: 'conn_llm',
      workspace_id: 'lakeview',
      name: 'OpenAI API',
      category: 'llm',
      provider: 'OpenAI GPT-4o / GPT-4o-mini',
      apiKeyMasked: 'sk-proj-lakeview••••••••••••18kE',
      status: 'connected',
      lastTested: '2026-03-28 09:12',
      details: 'Classification and SMS reminder drafting active.',
    },
    {
      id: 'conn_email',
      workspace_id: 'lakeview',
      name: 'Custom SMTP Server',
      category: 'email',
      provider: 'Postmark / SendGrid Relay',
      apiKeyMasked: 'SG.lake••••••••••••22fX',
      status: 'connected',
      lastTested: '2026-03-28 07:45',
      details: 'Transactional patient confirmations and follow-ups.',
    },
    {
      id: 'conn_sms',
      workspace_id: 'lakeview',
      name: 'Twilio SMS',
      category: 'sms',
      provider: 'Twilio Toll-Free & 10DLC',
      apiKeyMasked: 'AC771b••••••••••••33df',
      status: 'connected',
      lastTested: '2026-03-28 09:15',
      details: 'High-throughput 10DLC approved. 1,340 SMS processed this billing cycle.',
    },
    {
      id: 'conn_apollo',
      workspace_id: 'lakeview',
      name: 'Apollo Lead Enrichment',
      category: 'lead_data',
      provider: 'Apollo.io Enterprise API',
      apiKeyMasked: 'apo_key_••••••••••••33b9',
      status: 'connected',
      lastTested: '2026-03-27 14:00',
      details: 'Local healthcare partner enrichment.',
    },
    {
      id: 'conn_verify',
      workspace_id: 'lakeview',
      name: 'Email Verification Service',
      category: 'verification',
      provider: 'NeverBounce API',
      apiKeyMasked: 'nb_live_••••••••••••881a',
      status: 'connected',
      lastTested: '2026-03-28 08:30',
      details: 'Inbound form instant syntax & mailbox check.',
    },
    {
      id: 'conn_crm',
      workspace_id: 'lakeview',
      name: 'GoHighLevel CRM',
      category: 'crm',
      provider: 'GoHighLevel Agency API v2',
      apiKeyMasked: 'ghl_key_••••••••••••55pQ',
      status: 'connected',
      lastTested: '2026-03-28 09:10',
      details: 'Patient pipeline sync & appointment calendar hook active.',
    },
    {
      id: 'conn_meta',
      workspace_id: 'lakeview',
      name: 'Meta Lead Ads',
      category: 'social',
      provider: 'Meta Graph API v19',
      apiKeyMasked: 'EAADk••••••••••••99lm',
      status: 'connected',
      lastTested: '2026-03-28 09:00',
      details: 'Facebook Page: Lakeview Dental Family Care. Leads sync instantly.',
    },
    {
      id: 'conn_alerts',
      workspace_id: 'lakeview',
      name: 'Alerts & Webhooks',
      category: 'alerts',
      provider: 'Slack Webhook & SMS Ops',
      apiKeyMasked: 'hooks.slack.com/services/••••••••••••',
      status: 'connected',
      lastTested: '2026-03-28 08:50',
      details: 'Channel: #lakeview-patient-inquiries.',
    },
  ],
  ridgeway: [
    {
      id: 'conn_llm',
      workspace_id: 'ridgeway',
      name: 'OpenAI API',
      category: 'llm',
      provider: 'OpenAI GPT-4o / GPT-4o-mini',
      apiKeyMasked: 'sk-proj-ridge••••••••••••66tP',
      status: 'connected',
      lastTested: '2026-03-27 18:00',
      details: 'Commercial quote proposal drafter & score router.',
    },
    {
      id: 'conn_email',
      workspace_id: 'ridgeway',
      name: 'Instantly Email API',
      category: 'email',
      provider: 'Instantly Cold Email Suite',
      apiKeyMasked: 'inst_live_••••••••••••11wZ',
      status: 'connected',
      lastTested: '2026-03-28 07:10',
      details: '2 domains warming. 1,140 outbound messages delivered.',
    },
    {
      id: 'conn_sms',
      workspace_id: 'ridgeway',
      name: 'Twilio SMS',
      category: 'sms',
      provider: 'Twilio Messaging Service',
      apiKeyMasked: 'AC229c••••••••••••44qA',
      status: 'pending_review',
      lastTested: '2026-03-27 11:20',
      details: 'A2P 10DLC Brand approved, Campaign awaiting TCR registration approval.',
    },
    {
      id: 'conn_apollo',
      workspace_id: 'ridgeway',
      name: 'Apollo Lead Enrichment',
      category: 'lead_data',
      provider: 'Apollo.io API',
      apiKeyMasked: 'apo_key_••••••••••••90rR',
      status: 'connected',
      lastTested: '2026-03-28 06:40',
      details: 'Commercial facility & warehouse property owners.',
    },
    {
      id: 'conn_verify',
      workspace_id: 'ridgeway',
      name: 'Email Verification Service',
      category: 'verification',
      provider: 'ZeroBounce API',
      apiKeyMasked: 'zb_live_••••••••••••33qQ',
      status: 'connected',
      lastTested: '2026-03-27 19:30',
      details: 'Active batch verification pipeline.',
    },
    {
      id: 'conn_crm',
      workspace_id: 'ridgeway',
      name: 'HubSpot CRM',
      category: 'crm',
      provider: 'HubSpot Private App OAuth',
      apiKeyMasked: 'pat-na1-••••••••••••44vV',
      status: 'connected',
      lastTested: '2026-03-28 08:00',
      details: 'Deals pipeline mapped to Roofing Project estimation stages.',
    },
    {
      id: 'conn_meta',
      workspace_id: 'ridgeway',
      name: 'Meta Lead Ads',
      category: 'social',
      provider: 'Meta Graph API v19',
      apiKeyMasked: 'EAACx••••••••••••77bB',
      status: 'connected',
      lastTested: '2026-03-28 08:20',
      details: 'Storm damage inspection ad campaigns connected.',
    },
    {
      id: 'conn_alerts',
      workspace_id: 'ridgeway',
      name: 'Alerts & Webhooks',
      category: 'alerts',
      provider: 'Slack Webhook & Ops Email',
      apiKeyMasked: 'hooks.slack.com/services/••••••••••••',
      status: 'connected',
      lastTested: '2026-03-28 08:30',
      details: 'Channel: #ridgeway-roofing-leads.',
    },
  ],
};

// Initial Planned Campaigns
export const INITIAL_PLANS: PlannedCampaign[] = [
  {
    id: 'cmp_halden_01',
    workspace_id: 'halden',
    prompt: 'Find 100 qualified med spa owners in New York, enrich their contact information, create personalized outreach, add them to the CRM, and begin the approved campaign.',
    audience: 'Med Spa Owners & Medical Directors',
    titles: ['Clinic Owner', 'Medical Director', 'Managing Partner'],
    location: 'New York, NY (Tri-State Area)',
    count: 100,
    channels: ['email', 'linkedin'],
    sequenceSteps: [
      { step: 1, channel: 'Email', delay: 'Immediate', description: 'Personalized intro citing their specific clinic laser capabilities and NYC license.' },
      { step: 2, channel: 'LinkedIn', delay: 'Day 2', description: 'Connection request with note referencing clinical efficiency and equipment ROI.' },
      { step: 3, channel: 'Email', delay: 'Day 4', description: 'Value follow-up with benchmark data on aesthetic client retention.' },
    ],
    estimatedCost: 18.40,
    estimatedTime: '2 hours 15 minutes',
    sampleMessages: [
      {
        channel: 'Email',
        subject: 'Quick question regarding {{company}} clinical workflow',
        body: 'Hi {{firstName}}, I saw that {{company}} recently expanded your laser aesthetics roster in {{location}}. Many clinic owners we speak with find that provider credentialing and equipment utilization create unexpected scheduling bottlenecks. Are you open to a 7-minute benchmark comparison this Thursday?',
      },
      {
        channel: 'LinkedIn',
        body: 'Hi {{firstName}}, great work building out {{company}} in {{location}}. Would love to connect and share some aesthetic practice benchmark data we published this month.',
      },
      {
        channel: 'Email',
        subject: 'Benchmark notes for {{company}}',
        body: 'Hi {{firstName}}, following up on my previous note. We put together a short teardown on average treatment margin vs machine downtime for NYC med spas. Would you like me to drop the PDF here?',
      },
    ],
    status: 'pending_approval',
    createdAt: '2026-03-28 10:14',
    targetSpendCap: 250,
    dailySendLimit: 120,
  },
  {
    id: 'cmp_halden_02',
    workspace_id: 'halden',
    prompt: 'Re-engage cold med spa leads from Q4 with a special spring aesthetic partnership briefing.',
    audience: 'Cold Leads - Med Spa Administrators',
    titles: ['Practice Administrator', 'Operations Lead'],
    location: 'Northeast Region',
    count: 45,
    channels: ['email'],
    sequenceSteps: [
      { step: 1, channel: 'Email', delay: 'Immediate', description: 'Spring partnership update.' },
      { step: 2, channel: 'Email', delay: 'Day 5', description: 'Case study review.' },
    ],
    estimatedCost: 8.20,
    estimatedTime: '45 minutes',
    sampleMessages: [
      {
        channel: 'Email',
        subject: 'Spring partnership updates for {{company}}',
        body: 'Hi {{firstName}}, touching base as we roll out our Q2 aesthetic provider program in {{location}}.',
      },
    ],
    status: 'approved',
    createdAt: '2026-03-25 14:00',
    targetSpendCap: 100,
    dailySendLimit: 50,
  },
  {
    id: 'cmp_lakeview_01',
    workspace_id: 'lakeview',
    prompt: 'Capture 200 local family dental inquiries via web forms and Facebook ads, verify phone numbers, send instant SMS confirmation, and schedule cleanings.',
    audience: 'Local Household Dental Consumers',
    titles: ['Prospective Patient', 'Head of Household'],
    location: 'Greater Chicago, IL (15-mile radius)',
    count: 200,
    channels: ['sms', 'email'],
    sequenceSteps: [
      { step: 1, channel: 'SMS', delay: 'Instant (< 2 min)', description: 'Consent confirmation and instant booking link.' },
      { step: 2, channel: 'Email', delay: '10 min', description: 'Detailed new patient packet & insurance FAQ.' },
      { step: 3, channel: 'SMS', delay: 'Day 2', description: 'Friendly reminder if appointment not booked.' },
    ],
    estimatedCost: 26.50,
    estimatedTime: 'Continuous Inbound Stream',
    sampleMessages: [
      {
        channel: 'SMS',
        body: 'Lakeview Dental: Hi {{firstName}}, thank you for reaching out! Book your family cleaning or consult online here: https://lakeview.demo/book?id={{id}} Reply STOP to opt out.',
      },
      {
        channel: 'Email',
        subject: 'Welcome to Lakeview Dental Group - Your appointment details',
        body: 'Hi {{firstName}}, we received your inquiry. We have convenient evening and Saturday appointments available at both Chicago and Naperville clinics.',
      },
    ],
    status: 'approved',
    createdAt: '2026-03-24 09:00',
    targetSpendCap: 200,
    dailySendLimit: 300,
  },
  {
    id: 'cmp_ridgeway_01',
    workspace_id: 'ridgeway',
    prompt: 'Target commercial flat roof property owners in Denver metro, assess roof age from county records, send inspection email and follow up by SMS.',
    audience: 'Commercial Property Managers & Warehouse Owners',
    titles: ['Facility Manager', 'Property Owner', 'Asset Director'],
    location: 'Denver Metro, CO',
    count: 85,
    channels: ['email', 'sms'],
    sequenceSteps: [
      { step: 1, channel: 'Email', delay: 'Immediate', description: 'Commercial roof assessment proposal.' },
      { step: 2, channel: 'SMS', delay: 'Day 3', description: 'Notice of mobile crew in area.' },
    ],
    estimatedCost: 14.10,
    estimatedTime: '1 hour 40 minutes',
    sampleMessages: [
      {
        channel: 'Email',
        subject: 'Commercial roof inspection notice for {{company}}',
        body: 'Hi {{firstName}}, our commercial crew is inspecting properties in {{location}} next week following the recent freeze cycle.',
      },
    ],
    status: 'changes_requested',
    feedbackComment: 'Please adjust daily email pace to maximum 30 per inbox to maintain domain warmup reputation.',
    createdAt: '2026-03-27 15:30',
    targetSpendCap: 150,
    dailySendLimit: 40,
  },
];

// Initial Workflow Runs (n8n Orchestrator)
export const INITIAL_WORKFLOW_RUNS: WorkflowRun[] = [
  {
    id: 'run_8819',
    workspace_id: 'halden',
    workflowName: 'B2B Lead Ingest, Enrich & CRM Sync',
    trigger: 'AI Command Approved: cmp_halden_02',
    status: 'success',
    startedAt: '2026-03-28 08:30:12',
    duration: '4m 12s',
    campaignId: 'cmp_halden_02',
    steps: [
      { id: 's1', name: 'Apollo Query Filter', status: 'done', latency: '420ms', outputSummary: 'Fetched 45 verified records' },
      { id: 's2', name: 'ZeroBounce Verification', status: 'done', latency: '1.2s', outputSummary: '44 deliverable, 1 invalid suppressed' },
      { id: 's3', name: 'LLM Personalization Batch', status: 'done', latency: '2.1s', outputSummary: 'Generated 44 customized hooks' },
      { id: 's4', name: 'HubSpot CRM Sync', status: 'done', latency: '410ms', outputSummary: 'Upserted 44 contacts under Lead stage' },
    ],
  },
  {
    id: 'run_8820',
    workspace_id: 'halden',
    workflowName: 'Scheduled Outbound Dispatch: Batch 04',
    trigger: 'Cron (Sending Window Active 09:00)',
    status: 'retried',
    startedAt: '2026-03-28 09:05:00',
    duration: '3m 48s',
    campaignId: 'cmp_halden_01',
    steps: [
      { id: 's1', name: 'Read Pending Queue', status: 'done', latency: '120ms', outputSummary: '30 messages prepared' },
      { id: 's2', name: 'Rate Limiter Check', status: 'done', latency: '85ms', outputSummary: 'Daily inbox cap: 120, used: 42. OK.' },
      { id: 's3', name: 'Instantly API Dispatch', status: 'done', latency: '2.8s', outputSummary: 'Temporary 429 rate limit hit, auto-retry backoff (2500ms) succeeded.' },
      { id: 's4', name: 'Log Dispatch to Supabase', status: 'done', latency: '210ms', outputSummary: 'Recorded in workflow_executions table' },
    ],
  },
  {
    id: 'run_8821',
    workspace_id: 'halden',
    workflowName: 'Inbound Webhook: Bounce Spike Detector',
    trigger: 'Instantly Webhook Event (Hard Bounce)',
    status: 'paused_by_rule',
    startedAt: '2026-03-28 09:42:15',
    duration: '45s',
    campaignId: 'cmp_halden_01',
    steps: [
      { id: 's1', name: 'Receive Webhook', status: 'done', latency: '45ms', outputSummary: 'Bounce event captured for domain oldclinics.org' },
      { id: 's2', name: 'Evaluate Rule: Bounce Threshold', status: 'done', latency: '60ms', outputSummary: 'Rolling bounce rate at 3.8% (warning threshold reached)' },
      { id: 's3', name: 'Guardrail Enforcement', status: 'done', latency: '110ms', outputSummary: 'Batch sending throttled by code rule #05' },
    ],
    error: 'Execution throttled: Rolling bounce rate reached safety threshold.',
  },
  {
    id: 'run_8822',
    workspace_id: 'halden',
    workflowName: 'Dead Letter Queue Recovery',
    trigger: 'Manual DLQ Inspect',
    status: 'failed',
    startedAt: '2026-03-27 19:10:04',
    duration: '1m 02s',
    campaignId: 'cmp_halden_01',
    isDeadLetter: true,
    steps: [
      { id: 's1', name: 'Inspect DLQ Record', status: 'done', latency: '90ms', outputSummary: 'Invalid RFC recipient syntax' },
      { id: 's2', name: 'Attempt Data Normalization', status: 'failed', latency: '350ms', outputSummary: 'Unrecoverable malformed domain syntax' },
    ],
    error: 'RFC5322 validation failure: Unrecoverable domain structure in lead_halden_013.',
  },
  // Lakeview runs
  {
    id: 'run_9011',
    workspace_id: 'lakeview',
    workflowName: 'B2C Webhook Ingest & SMS Confirmation',
    trigger: 'Web Form Submission: New Patient Consult',
    status: 'success',
    startedAt: '2026-03-28 09:18:22',
    duration: '1m 15s',
    campaignId: 'cmp_lakeview_01',
    steps: [
      { id: 's1', name: 'Validate Phone Format', status: 'done', latency: '40ms', outputSummary: 'E.164 normalized' },
      { id: 's2', name: 'Verify SMS Consent Checkbox', status: 'done', latency: '30ms', outputSummary: 'Consent logged with timestamp' },
      { id: 's3', name: 'Twilio SMS Dispatch', status: 'done', latency: '380ms', outputSummary: 'Message SID SM99201 delivered' },
      { id: 's4', name: 'GHL Contact Upsert', status: 'done', latency: '290ms', outputSummary: 'Added to Inbound Pipeline' },
    ],
  },
  // Ridgeway runs
  {
    id: 'run_9201',
    workspace_id: 'ridgeway',
    workflowName: 'Commercial Roof Ingest & County Assessor Match',
    trigger: 'CSV Batch Import (85 Rows)',
    status: 'success',
    startedAt: '2026-03-27 16:00:00',
    duration: '2m 50s',
    campaignId: 'cmp_ridgeway_01',
    steps: [
      { id: 's1', name: 'Parse CSV', status: 'done', latency: '110ms', outputSummary: 'Parsed 85 commercial parcel records' },
      { id: 's2', name: 'ZeroBounce Verification', status: 'done', latency: '1.4s', outputSummary: '82 valid emails verified' },
      { id: 's3', name: 'HubSpot Deal Creation', status: 'done', latency: '540ms', outputSummary: 'Associated with Commercial Pipeline' },
    ],
  },
];

// 8 Code Enforced Rules
export const INITIAL_CODE_RULES: CodeRule[] = [
  {
    id: 'rule_01',
    workspace_id: 'halden',
    code: 'RULE_OPT_OUT_IMMEDIATE',
    name: 'Immediate Opt-Out Suppression',
    description: 'Any STOP, UNSUBSCRIBE, or unsubscribe link click instantly writes recipient to suppression list and cancels scheduled steps in code before next cron tick.',
    value: true,
    type: 'toggle',
    enabled: true,
    enforcedInCode: true,
  },
  {
    id: 'rule_02',
    workspace_id: 'halden',
    code: 'RULE_STOP_ON_REPLY',
    name: 'Stop Sequence on Prospect Reply',
    description: 'When inbound reply webhook or IMAP event triggers, all subsequent automated outbound steps for this prospect are deleted instantly.',
    value: true,
    type: 'toggle',
    enabled: true,
    enforcedInCode: true,
  },
  {
    id: 'rule_03',
    workspace_id: 'halden',
    code: 'RULE_DAILY_INBOX_CAP',
    name: 'Daily Send Cap Per Sender Inbox',
    description: 'Hard limit on daily message dispatches per connected mailbox to preserve domain reputation and avoid spam filters.',
    value: 35,
    unit: 'emails / inbox / day',
    type: 'number',
    enabled: true,
    enforcedInCode: true,
  },
  {
    id: 'rule_04',
    workspace_id: 'halden',
    code: 'RULE_SENDING_WINDOW',
    name: 'Sending Window Enforcement',
    description: 'Messages are only queued and sent during business hours in the recipient local timezone.',
    value: '09:00 - 17:00 (Mon - Fri)',
    unit: 'local time',
    type: 'text',
    enabled: true,
    enforcedInCode: true,
  },
  {
    id: 'rule_05',
    workspace_id: 'halden',
    code: 'RULE_BOUNCE_THRESHOLD_PAUSE',
    name: 'Bounce Threshold Auto-Pause',
    description: 'If rolling campaign bounce rate exceeds threshold over a 24-hour window, campaign automatically halts and notifies Slack ops channel.',
    value: 4.5,
    unit: '% bounce rate',
    type: 'number',
    enabled: true,
    enforcedInCode: true,
  },
  {
    id: 'rule_06',
    workspace_id: 'halden',
    code: 'RULE_CAMPAIGN_SPEND_CAP',
    name: 'Spend Cap Per Campaign',
    description: 'Hard expenditure ceiling on enrichment, email verification, and AI completion tokens per campaign.',
    value: 250,
    unit: 'USD',
    type: 'number',
    enabled: true,
    enforcedInCode: true,
  },
  {
    id: 'rule_07',
    workspace_id: 'halden',
    code: 'RULE_MONTHLY_WORKSPACE_CAP',
    name: 'Monthly Workspace Spend Cap',
    description: 'Total tenant-level budget protection cap across all automated operations.',
    value: 1000,
    unit: 'USD / month',
    type: 'number',
    enabled: true,
    enforcedInCode: true,
  },
  {
    id: 'rule_08',
    workspace_id: 'halden',
    code: 'RULE_MAX_STEPS_PER_RUN',
    name: 'Max Workflow Steps Per Run',
    description: 'Execution recursion limit guarding n8n orchestrator from infinite loops or duplicate triggers.',
    value: 25,
    unit: 'steps / run',
    type: 'number',
    enabled: true,
    enforcedInCode: true,
  },
];

// Initial Rule Decision Log
export const INITIAL_RULE_LOGS: RuleDecisionLog[] = [
  {
    id: 'dec_101',
    workspace_id: 'halden',
    timestamp: '2026-03-28 09:44:10',
    ruleCode: 'RULE_OPT_OUT_IMMEDIATE',
    ruleName: 'Immediate Opt-Out Suppression',
    target: 'dr.bauer@manhattanderma.com',
    action: 'blocked',
    reason: 'Recipient replied with unsubscribe intent. Suppressed instantly in memory & Supabase.',
  },
  {
    id: 'dec_102',
    workspace_id: 'halden',
    timestamp: '2026-03-28 09:30:05',
    ruleCode: 'RULE_DAILY_INBOX_CAP',
    ruleName: 'Daily Send Cap Per Sender Inbox',
    target: 'inbox_02@haldenoutreach.com',
    action: 'allowed',
    reason: 'Sent 28 of 35 allowed emails today. Within safety parameters.',
  },
  {
    id: 'dec_103',
    workspace_id: 'halden',
    timestamp: '2026-03-28 09:15:22',
    ruleCode: 'RULE_STOP_ON_REPLY',
    ruleName: 'Stop Sequence on Prospect Reply',
    target: 'elena.vance@tribecamedspa.com',
    action: 'blocked',
    reason: 'Positive reply logged. Canceled Step 2 and Step 3 automated follow-ups.',
  },
  {
    id: 'dec_104',
    workspace_id: 'halden',
    timestamp: '2026-03-28 08:59:12',
    ruleCode: 'RULE_SENDING_WINDOW',
    ruleName: 'Sending Window Enforcement',
    target: 'Batch #14 (40 items)',
    action: 'blocked',
    reason: 'Attempted dispatch at 08:59 EST. Held until 09:00:00 EST window opening.',
  },
  {
    id: 'dec_105',
    workspace_id: 'halden',
    timestamp: '2026-03-28 08:00:01',
    ruleCode: 'RULE_CAMPAIGN_SPEND_CAP',
    ruleName: 'Spend Cap Per Campaign',
    target: 'cmp_halden_01',
    action: 'allowed',
    reason: 'Current spend $68.40 vs cap $250.00. Budget approved.',
  },
];

// Initial Email Sender Inboxes
export const INITIAL_EMAIL_INBOXES: EmailSenderInbox[] = [
  {
    id: 'inbox_1',
    workspace_id: 'halden',
    email: 'marcus@haldenpartners.com',
    domain: 'haldenpartners.com',
    spf: 'pass',
    dkim: 'pass',
    dmarc: 'pass',
    warmupProgress: 100,
    dailyLimit: 35,
    sentToday: 18,
    status: 'active',
  },
  {
    id: 'inbox_2',
    workspace_id: 'halden',
    email: 'elena@haldenoutreach.com',
    domain: 'haldenoutreach.com',
    spf: 'pass',
    dkim: 'pass',
    dmarc: 'pass',
    warmupProgress: 94,
    dailyLimit: 35,
    sentToday: 24,
    status: 'active',
  },
  {
    id: 'inbox_3',
    workspace_id: 'halden',
    email: 'partners@haldenhealth.org',
    domain: 'haldenhealth.org',
    spf: 'pass',
    dkim: 'pass',
    dmarc: 'pass',
    warmupProgress: 78,
    dailyLimit: 25,
    sentToday: 12,
    status: 'warming',
  },
  {
    id: 'inbox_4',
    workspace_id: 'lakeview',
    email: 'care@lakeviewdentalcare.com',
    domain: 'lakeviewdentalcare.com',
    spf: 'pass',
    dkim: 'pass',
    dmarc: 'pass',
    warmupProgress: 100,
    dailyLimit: 100,
    sentToday: 42,
    status: 'active',
  },
  {
    id: 'inbox_5',
    workspace_id: 'ridgeway',
    email: 'commercial@ridgewayroofingco.com',
    domain: 'ridgewayroofingco.com',
    spf: 'pass',
    dkim: 'pass',
    dmarc: 'pass',
    warmupProgress: 88,
    dailyLimit: 30,
    sentToday: 19,
    status: 'active',
  },
];

// Initial Email Sequences
export const INITIAL_EMAIL_SEQUENCES: EmailSequence[] = [
  {
    id: 'seq_halden_01',
    workspace_id: 'halden',
    name: 'NYC Med Spa Owner Direct Cadence',
    status: 'active',
    sentCount: 1420,
    openRate: 58.4,
    replyRate: 16.2,
    bounceRate: 1.8,
    steps: [
      {
        step: 1,
        dayOffset: 0,
        type: 'email',
        subject: 'Quick question regarding {{company}} clinical workflow',
        body: 'Hi {{firstName}}, I noticed {{company}} provides premier medical aesthetics in {{location}}. Many clinic owners we work with find that provider credentialing and equipment utilization create unexpected scheduling bottlenecks.',
        aiPersonalization: true,
        samplePersonalized: 'Elena, saw that Tribeca Med Spa recently expanded your laser aesthetics roster on Greenwich St. Many clinic owners find provider scheduling bottlenecks eat into treatment margin.',
      },
      {
        step: 2,
        dayOffset: 3,
        type: 'email',
        subject: 'Following up on NYC clinic benchmark data',
        body: 'Hi {{firstName}}, following up on my earlier note. We assembled an analysis of treatment room yield per practitioner across Manhattan and Brooklyn clinics.',
        aiPersonalization: true,
        samplePersonalized: 'Elena, wanted to share our Q1 benchmark noting how Tribeca and SoHo practices maintain 82% room capacity.',
      },
      {
        step: 3,
        dayOffset: 7,
        type: 'email',
        subject: 'Should I close out your file for {{company}}?',
        body: 'Hi {{firstName}}, since I haven’t heard back, I assume improving treatment efficiency isn’t an immediate priority right now. If things change in Q2, feel free to reply anytime.',
        aiPersonalization: false,
      },
    ],
  },
];

// Initial Replies Inbox
export const INITIAL_REPLIES: ReplyItem[] = [
  {
    id: 'rep_01',
    workspace_id: 'halden',
    leadName: 'Dr. Arthur Bauer',
    fromEmail: 'dr.bauer@manhattanderma.com',
    subject: 'Re: Quick question regarding Manhattan Derma Lounge clinical workflow',
    body: 'Hi Marcus, thanks for reaching out. Yes, we are actually evaluating new scheduling and device management tools this quarter. Can you send over a brief 1-pager or pricing overview?',
    receivedAt: '2026-03-28 09:12',
    sentiment: 'positive',
    campaignName: 'NYC Med Spa Owner Direct Cadence',
    handled: true,
  },
  {
    id: 'rep_02',
    workspace_id: 'halden',
    leadName: 'Chloe Chen',
    fromEmail: 'chloe@parkaveaesthetics.com',
    subject: 'Re: Following up on NYC clinic benchmark data',
    body: 'Not right now please. We just locked in our operational software through the end of the year.',
    receivedAt: '2026-03-28 08:45',
    sentiment: 'not now',
    campaignName: 'NYC Med Spa Owner Direct Cadence',
    handled: false,
  },
  {
    id: 'rep_03',
    workspace_id: 'halden',
    leadName: 'Gideon Sinclair',
    fromEmail: 'g.sinclair@auracosmetic.com',
    subject: 'Re: Quick question regarding Aura Cosmetic Care',
    body: 'Please unsubscribe this address and remove us from your list immediately.',
    receivedAt: '2026-03-27 16:30',
    sentiment: 'unsubscribe',
    campaignName: 'NYC Med Spa Owner Direct Cadence',
    handled: true,
  },
  {
    id: 'rep_04',
    workspace_id: 'halden',
    leadName: 'Mail Delivery System',
    fromEmail: 'mailer-daemon@hudsonvalleylaser.com',
    subject: 'Undelivered Mail Returned to Sender',
    body: '550 5.1.1 The email account that you tried to reach does not exist. Please try double-checking the recipient email address.',
    receivedAt: '2026-03-27 14:10',
    sentiment: 'bounce',
    campaignName: 'NYC Med Spa Owner Direct Cadence',
    handled: true,
  },
  {
    id: 'rep_05',
    workspace_id: 'halden',
    leadName: 'Dominic Reyes',
    fromEmail: 'reyes@vervemed.com',
    subject: 'Automatic reply: Out of Office until April 2',
    body: 'Thank you for your email. I am currently out of the clinic attending the American Society for Laser Medicine and Surgery conference. For urgent clinical matters contact desk@vervemed.com.',
    receivedAt: '2026-03-28 07:22',
    sentiment: 'out of office',
    campaignName: 'NYC Med Spa Owner Direct Cadence',
    handled: false,
  },
  {
    id: 'rep_06',
    workspace_id: 'lakeview',
    leadName: 'Sarah Jenkins',
    fromEmail: 'sarah.j88@gmail.com',
    subject: 'Re: Welcome to Lakeview Dental Group',
    body: 'Hi, can I bring both of my kids at the same time on Saturday morning for a cleaning? We have Delta Dental insurance.',
    receivedAt: '2026-03-28 09:20',
    sentiment: 'positive',
    campaignName: 'Family Dental Inbound Lead Nurture',
    handled: false,
  },
];

// Initial SMS Records
export const INITIAL_SMS_RECORDS: SmsRecord[] = [
  {
    id: 'sms_01',
    workspace_id: 'lakeview',
    leadName: 'Michael Chang',
    phone: '+1 (312) 555-0144',
    direction: 'outbound',
    message: 'Lakeview Dental: Hi Michael, your appointment inquiry was received! Choose your consult time here: https://lakeview.demo/b/991 Reply STOP to opt out.',
    timestamp: '2026-03-28 09:18',
    status: 'delivered',
  },
  {
    id: 'sms_02',
    workspace_id: 'lakeview',
    leadName: 'Michael Chang',
    phone: '+1 (312) 555-0144',
    direction: 'inbound',
    message: 'Just booked for 11am Saturday, thanks!',
    timestamp: '2026-03-28 09:21',
    status: 'received',
  },
  {
    id: 'sms_03',
    workspace_id: 'lakeview',
    leadName: 'Jessica Taylor',
    phone: '+1 (312) 555-0199',
    direction: 'outbound',
    message: 'Lakeview Dental: Friendly reminder for your cleaning consult on Monday March 30 at 10:00 AM. Reply C to confirm or R to reschedule. Reply STOP to cancel.',
    timestamp: '2026-03-27 15:00',
    status: 'delivered',
  },
  {
    id: 'sms_04',
    workspace_id: 'lakeview',
    leadName: 'Jessica Taylor',
    phone: '+1 (312) 555-0199',
    direction: 'inbound',
    message: 'C',
    timestamp: '2026-03-27 15:04',
    status: 'received',
  },
  {
    id: 'sms_05',
    workspace_id: 'lakeview',
    leadName: 'Brian Miller',
    phone: '+1 (312) 555-0211',
    direction: 'inbound',
    message: 'STOP',
    timestamp: '2026-03-26 11:15',
    status: 'opt_out',
  },
];

// Initial Social Posts (Conditional / Workflows)
export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post_01',
    workspace_id: 'halden',
    platform: 'linkedin',
    caption: 'How top medical aesthetic practices in the Northeast are improving treatment room utilization by 28% without increasing provider overtime. Read our Q1 practice ops brief: https://halden.demo/brief',
    scheduledDate: '2026-03-29',
    scheduledTime: '10:00 EST',
    status: 'scheduled',
    metrics: { impressions: 1420, clicks: 88, engagementRate: '4.8%' },
  },
  {
    id: 'post_02',
    workspace_id: 'halden',
    platform: 'instagram',
    caption: 'Behind the clinical standard: precision laser protocols and direct patient booking. Quality aesthetic care begins with disciplined practice operations.',
    scheduledDate: '2026-03-30',
    scheduledTime: '14:30 EST',
    status: 'pending_approval',
    metrics: { impressions: 0, clicks: 0, engagementRate: '0%' },
  },
  {
    id: 'post_03',
    workspace_id: 'halden',
    platform: 'facebook',
    caption: 'Spring clinical spotlight: partnering with certified dermatology providers across New York and New Jersey to streamline patient consultations.',
    scheduledDate: '2026-04-01',
    scheduledTime: '11:15 EST',
    status: 'draft',
    metrics: { impressions: 0, clicks: 0, engagementRate: '0%' },
  },
  {
    id: 'post_04',
    workspace_id: 'lakeview',
    platform: 'facebook',
    caption: 'Did you know most dental insurance benefits reset every year? Schedule your family preventive cleaning before the busy summer season.',
    scheduledDate: '2026-03-29',
    scheduledTime: '09:00 CST',
    status: 'scheduled',
    metrics: { impressions: 2100, clicks: 140, engagementRate: '6.2%' },
  },
];

// Initial Follow-Up Rules
export const INITIAL_FOLLOWUP_RULES: FollowUpRule[] = [
  {
    id: 'fu_01',
    workspace_id: 'halden',
    event: 'no_response_48h',
    eventLabel: 'No response after 48 hours',
    action: 'Queue Step 2 nurture email with benchmark PDF link and check sender inbox daily quota',
    channel: 'email',
    enabled: true,
  },
  {
    id: 'fu_02',
    workspace_id: 'halden',
    event: 'positive_reply',
    eventLabel: 'Positive reply classified',
    action: 'Update CRM stage to Qualified, pause all outbound automation, and alert sales rep in Slack #ops',
    channel: 'crm',
    enabled: true,
  },
  {
    id: 'fu_03',
    workspace_id: 'halden',
    event: 'appointment_booked',
    eventLabel: 'Appointment or demo booked',
    action: 'Move to Appointment stage in HubSpot, trigger calendar invite, and dispatch SMS confirmation',
    channel: 'sms',
    enabled: true,
  },
  {
    id: 'fu_04',
    workspace_id: 'halden',
    event: 'opt_out',
    eventLabel: 'Unsubscribe / Opt-out requested',
    action: 'Immediately append to suppression list, cancel pending runs, set consent status to Unsubscribed',
    channel: 'email',
    enabled: true,
  },
  {
    id: 'fu_05',
    workspace_id: 'halden',
    event: 'became_customer',
    eventLabel: 'Deal won / became customer',
    action: 'Move to Customer stage, tag as Active Client, trigger onboarding notification',
    channel: 'crm',
    enabled: true,
  },
];

// Initial Suppression List
export const INITIAL_SUPPRESSION_LIST: SuppressionRecord[] = [
  {
    id: 'sup_01',
    workspace_id: 'halden',
    type: 'email',
    value: 'g.sinclair@auracosmetic.com',
    reason: 'user_opt_out',
    source: 'Inbound Reply Parser (RULE_OPT_OUT_IMMEDIATE)',
    addedAt: '2026-03-27 16:30',
  },
  {
    id: 'sup_02',
    workspace_id: 'halden',
    type: 'email',
    value: 'invalid.bounce@oldclinics.org',
    reason: 'hard_bounce',
    source: 'Instantly SMTP Webhook 550 User Not Found',
    addedAt: '2026-03-27 14:10',
  },
  {
    id: 'sup_03',
    workspace_id: 'halden',
    type: 'domain',
    value: 'competitoraesthetics.com',
    reason: 'manual_suppression',
    source: 'Admin Exclusion Rule',
    addedAt: '2026-03-20 09:00',
  },
  {
    id: 'sup_04',
    workspace_id: 'lakeview',
    type: 'phone',
    value: '+1 (312) 555-0211',
    reason: 'user_opt_out',
    source: 'Twilio SMS STOP Keyword',
    addedAt: '2026-03-26 11:15',
  },
  {
    id: 'sup_05',
    workspace_id: 'ridgeway',
    type: 'email',
    value: 'spam-trap-detected@badparcels.com',
    reason: 'complaint',
    source: 'ZeroBounce Verification Failure',
    addedAt: '2026-03-25 10:12',
  },
];

// Initial Logs
export const INITIAL_SYSTEM_LOGS: SystemLogEntry[] = [
  {
    id: 'log_01',
    workspace_id: 'halden',
    type: 'ai_action',
    timestamp: '2026-03-28 10:14:22',
    actor: 'OpenAI GPT-4o-mini',
    action: 'Classify Sentiment & Intent',
    details: 'Evaluated reply from dr.bauer@manhattanderma.com. Result: positive (confidence 0.96).',
    status: 'success',
  },
  {
    id: 'log_02',
    workspace_id: 'halden',
    type: 'workflow',
    timestamp: '2026-03-28 10:14:23',
    actor: 'Follow-up Engine',
    action: 'Auto Stage Update',
    details: 'Moved lead_halden_007 from Contacted to Qualified. Notified #halden-ops-alerts.',
    status: 'success',
  },
  {
    id: 'log_03',
    workspace_id: 'halden',
    type: 'audit',
    timestamp: '2026-03-28 09:30:00',
    actor: 'operator@halden.demo',
    action: 'Update Rule Parameter',
    details: 'Changed daily send cap from 30 to 35 on inbox marcus@haldenpartners.com.',
    status: 'success',
  },
  {
    id: 'log_04',
    workspace_id: 'halden',
    type: 'workflow',
    timestamp: '2026-03-28 09:05:00',
    actor: 'n8n Orchestrator',
    action: 'Backoff Retry Executed',
    details: 'Workflow run_8820 hit rate limit on Instantly. Resumed in 2500ms and completed.',
    status: 'warning',
  },
  {
    id: 'log_05',
    workspace_id: 'halden',
    type: 'ai_action',
    timestamp: '2026-03-28 08:31:05',
    actor: 'OpenAI GPT-4o',
    action: 'Generate Outreach Personalization',
    details: 'Batch completed 44 hooks for campaign cmp_halden_02 in 2.1s (Tokens: 3,420).',
    status: 'success',
  },
];

// Initial Team Members
export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'usr_01',
    workspace_id: 'halden',
    name: 'Sarah Halden',
    email: 'sarah@haldenaesthetics.com',
    role: 'owner',
    avatar: 'SH',
    lastActive: 'Active now',
  },
  {
    id: 'usr_02',
    workspace_id: 'halden',
    name: 'Julian Vance',
    email: 'julian@haldenaesthetics.com',
    role: 'admin',
    avatar: 'JV',
    lastActive: '12m ago',
  },
  {
    id: 'usr_03',
    workspace_id: 'halden',
    name: 'Chloe Mercer',
    email: 'chloe@haldenaesthetics.com',
    role: 'operator',
    avatar: 'CM',
    lastActive: '1h ago',
  },
  {
    id: 'usr_04',
    workspace_id: 'halden',
    name: 'David Bauer',
    email: 'david.auditor@externalops.com',
    role: 'viewer',
    avatar: 'DB',
    lastActive: 'Yesterday',
  },
];

// Initial CRM Tasks
export const INITIAL_CRM_TASKS: CrmTask[] = [
  {
    id: 'task_01',
    workspace_id: 'halden',
    title: 'Review custom clinical trial quote for Dr. Bauer',
    dueDate: '2026-03-29',
    leadName: 'Dr. Arthur Bauer',
    leadCompany: 'Manhattan Derma Lounge',
    completed: false,
    priority: 'high',
  },
  {
    id: 'task_02',
    workspace_id: 'halden',
    title: 'Confirm appointment room schedule and prep demo deck',
    dueDate: '2026-03-30',
    leadName: 'Elena Vance',
    leadCompany: 'Tribeca Med Spa',
    completed: false,
    priority: 'medium',
  },
  {
    id: 'task_03',
    workspace_id: 'halden',
    title: 'Verify SPF / DKIM alignment on new outreach domain',
    dueDate: '2026-03-28',
    leadName: 'Infrastructure Task',
    leadCompany: 'Internal IT',
    completed: true,
    priority: 'low',
  },
];
