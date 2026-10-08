export interface GuidedTourStep {
  index: number;
  title: string;
  stepName: string;
  route: string;
  diagramChip: string;
  description: string;
  systemActionSummary: string;
}

export const GUIDED_TOUR_STEPS: GuidedTourStep[] = [
  {
    index: 0,
    title: 'Campaign Instruction',
    stepName: '01 Campaign Instruction',
    route: '/control/command-center',
    diagramChip: '01 Control / AI command center',
    description: 'An operator enters a high-level natural language prompt into the AI command center. The system interprets criteria, constructs sequence steps, and generates sample copy.',
    systemActionSummary: 'Prompt analyzed. 3-touch multi-channel plan generated and sent to Approval Gate.',
  },
  {
    index: 1,
    title: 'Approval Gate',
    stepName: '02 Approval Gate',
    route: '/control/approval-gate',
    diagramChip: '01 Control / Approval gate',
    description: 'Human-in-the-loop governance. An administrator reviews the planned audience, message copy, send rate limits, and spend cap before any external action executes.',
    systemActionSummary: 'Risk checks passed. Plan approved by operator, triggering n8n orchestrator.',
  },
  {
    index: 2,
    title: 'Lead Acquisition',
    stepName: '03 Lead Acquisition',
    route: '/workflows/b2b-leads',
    diagramChip: '03 Workflows / B2B leads / Apollo',
    description: 'The B2B leads workflow queries Apollo criteria for clinic owners and medical directors with active commercial practices in New York.',
    systemActionSummary: '100 target records fetched within workspace daily rate limit.',
  },
  {
    index: 3,
    title: 'Enrichment & Verification',
    stepName: '04 Verification & Enrichment',
    route: '/data/leads',
    diagramChip: '04 Data / Supabase (PostgreSQL)',
    description: 'Every record is enriched with clinic location and verified via SMTP mailbox handshake and catch-all MX verification before dispatch.',
    systemActionSummary: '100% deliverability check complete. Scores calculated and stored with workspace_id.',
  },
  {
    index: 4,
    title: 'CRM Entry',
    stepName: '05 CRM Synchronization',
    route: '/data/crm',
    diagramChip: '04 Data / CRM (HubSpot / GoHighLevel)',
    description: 'Enriched prospects are automatically upserted into the client CRM board under the initial "Lead" column, with full audit lineage.',
    systemActionSummary: 'Contacts mapped to HubSpot CRM. Deal records and ownership initialized.',
  },
  {
    index: 5,
    title: 'AI Personalization',
    stepName: '06 AI Personalization',
    route: '/workflows/email-sequences',
    diagramChip: '03 Workflows / Email sequences / Instantly',
    description: 'The LLM router passes each prospect dossier to the tier-2 model, generating individualized hooks based on equipment, location, and credentials.',
    systemActionSummary: 'Custom hooks synthesized per inbox without generic templates.',
  },
  {
    index: 6,
    title: 'Outreach Dispatch',
    stepName: '07 Outreach Dispatch',
    route: '/orchestration/runs',
    diagramChip: '02 Orchestration / n8n orchestrator',
    description: 'The n8n orchestrator executes the outreach batch via Instantly API, pacing deliveries within daily sending caps and timezone windows.',
    systemActionSummary: 'Workflow run 8820 executed. 30 messages safely dispatched.',
  },
  {
    index: 7,
    title: 'Follow-up Engine',
    stepName: '08 Follow-up Engine',
    route: '/workflows/follow-up',
    diagramChip: '03 Workflows / Follow-up engine',
    description: 'The follow-up state machine evaluates responses against code-enforced guardrails, queuing Day 4 reminders only for non-responders.',
    systemActionSummary: '48-hour wait timers active. Webhook listener primed for replies.',
  },
  {
    index: 8,
    title: 'Inbound Response',
    stepName: '09 Response Ingestion',
    route: '/workflows/email-sequences',
    diagramChip: '03 Workflows / Email sequences / Reply Inbox',
    description: 'A prospect responds to Step 1. The LLM sentiment router classifies the email as positive, and rule #02 halts all subsequent automated touches.',
    systemActionSummary: 'Positive sentiment detected (0.96 confidence). Stop-on-reply rule enforced.',
  },
  {
    index: 9,
    title: 'CRM Progression',
    stepName: '10 CRM Stage Update',
    route: '/data/crm',
    diagramChip: '04 Data / CRM (HubSpot / GoHighLevel)',
    description: 'The follow-up engine updates the CRM pipeline card in real time, advancing Dr. Arthur Bauer directly from Contacted to "Appointment".',
    systemActionSummary: 'Kanban card moved to Appointment column. Sales rep task created.',
  },
  {
    index: 10,
    title: 'Reporting & ROI',
    stepName: '11 Reporting & Economics',
    route: '/output/dashboard',
    diagramChip: '05 Output / Dashboard',
    description: 'Executive dashboard reflects updated performance metrics: responses, conversions, pipeline value generated, and exact AI unit economics.',
    systemActionSummary: 'End-to-end flow verified. All components in architecture executed.',
  },
];
