# Multi-Tenant Marketing Platform Architecture Demo

A clickable, browser-only demonstration of a multi-tenant SaaS marketing operations engine. This demo translates a five-layer architectural diagram into functional interfaces backed by deterministic seeded mock data and local browser persistence.

---

## 1. Architecture Layers, Diagram Boxes & Route Directory

Every screen corresponds directly to a box within the 5-layer system architecture diagram and exhibits a header chip indicating its architectural layer.

### System Map & Authentication
| Diagram Box | Route | Interface Description | Legend Type |
|---|---|---|---|
| **System Map** | `/` | HTML/CSS interactive diagram of the entire 5-layer platform with hover tooltips and guided tour launcher. | Built by us (Solid border) |
| **Auth / Login** | `/auth/login` | Minimalist login screen with tenant organization switcher. | Built by us (Solid border) |
| **Auth / Register** | `/auth/register` | Workspace provisioning form with quota preview. | Built by us (Solid border) |
| **Onboarding** | `/onboarding` | 4-step checklist: LLM, Email, CRM, and First Campaign. | Built by us (Solid border) |

### 01 Control Layer
| Diagram Box | Route | Interface Description | Legend Type |
|---|---|---|---|
| **Operator** | `/control/operator` | Operational cockpit for system-wide pausing, active worker telemetry, and circuit breaker overrides. | Built by us (Solid border) |
| **AI Command Center** | `/control/command-center` | Natural language compiler generating structured plans, channels, sequence steps, and copy samples. | Built by us (Solid border) |
| **Approval Gate** | `/control/approval-gate` | Human-in-the-loop review queue for approving campaigns, inspecting spend caps, or requesting changes. | Built by us (Solid border) |

### 02 Orchestration Layer
| Diagram Box | Route | Interface Description | Legend Type |
|---|---|---|---|
| **n8n Orchestrator** | `/orchestration/runs` | Execution runs table with status filters, duration, step timeline modal, retry action, and dead-letter queue. | Built by us (Solid border) |
| **LLM Router** | `/orchestration/llm-router` | Task-to-tier matrix routing Tier 1 (mini: scoring, sentiment) and Tier 2 (gpt-4o: personalization copy). | Built by us (Solid border) |
| **OpenAI API** | `/orchestration/openai` | Provider configuration, masked credentials, token allowance sliders, and latency tester. | Bought tool (Dashed border) |
| **Rules in Code** | `/orchestration/rules` | 8 deterministic guardrails with decision log stream and test buttons (simulate opt-out, bounce spike, spend cap). | Built by us (Solid border) |

### 03 Workflows Layer
| Diagram Box | Route | Interface Description | Legend Type |
|---|---|---|---|
| **B2B Leads** | `/workflows/b2b-leads` | Apollo search criteria wizard, daily volume control (100 to 500+), live count preview, and scored leads table. | Built by us (Solid border) |
| **B2C Capture** | `/workflows/b2c-capture` | Landing pages preview, embeddable form codes, web inquiry feed, CSV list import, and Meta Ads status. | Built by us (Solid border) |
| **Email Sequences** | `/workflows/email-sequences` | Step builder with AI personalization sample, sender inboxes warmup, sentiment reply inbox, and deliverability panel. | Built by us (Solid border) |
| **SMS** | `/workflows/sms` | Twilio 10DLC registration status, composer with character count & opt-out line, appointment templates, and threads. | Built by us (Solid border) |
| **Social (Conditional)** | `/workflows/social` | Scheduled post calendar, AI draft composer, platform approval state, and engagement metrics. | Built by us (Solid border) |
| **Follow-up Engine** | `/workflows/follow-up` | 5-event transition state machine and interactive reply evaluation playground. | Built by us (Solid border) |

### 04 Data Layer
| Diagram Box | Route | Interface Description | Legend Type |
|---|---|---|---|
| **Supabase (PostgreSQL)** | `/data/leads` | Filterable tenant leads table with slide-over drawer showing timeline, source, score, consent, and notes. | Our database (Filled) |
| **CRM (HubSpot / GHL)** | `/data/crm` | 7-stage interactive drag-and-drop Kanban pipeline, tasks backlog, and bidirectional sync switch. | Bought tool (Dashed border) |
| **Suppression List** | `/data/suppression` | Global opt-out and bounce registry, address checker, and manual exclusion manager. | Our database (Filled) |
| **Logs & Audit** | `/data/logs` | Immutable event stream for AI completions, workflow events, and operator audit compliance. | Our database (Filled) |

### 05 Output Layer
| Diagram Box | Route | Interface Description | Legend Type |
|---|---|---|---|
| **Dashboard** | `/output/dashboard` | Conversion funnel, channel breakdown, emails sent, bounce rates, replies, appointments, and pipeline charts. | Built by us (Solid border) |
| **Costs** | `/output/costs` | Spend per campaign breakdown, token consumption by tier, spend cap meter, and monthly vendor estimates. | Built by us (Solid border) |

### Workspace & Roadmap Items
| Item | Route | Interface Description |
|---|---|---|
| **Integrations** | `/workspace/integrations` | All 8 third-party connections with masked keys, test buttons, and timestamps. |
| **Team & Roles** | `/workspace/team` | Team seats list, member invitation modal, and live RBAC capability matrix. |
| **Plan & Usage** | `/workspace/usage` | Resource consumption meters (leads, emails, SMS, AI spend) and subscription tier cards. |
| **Settings** | `/workspace/settings` | Operating timezone, sending hours window, default caps, and data retention parameters. |
| **Admin App (Phase 2)** | `/phase2/admin-app` | Locked sidebar entry opening dialog: "Not in phase 1". |
| **Tenant App (Phase 2)** | `/phase2/tenant-app` | Locked sidebar entry opening dialog: "Not in phase 1". |
| **Custom CRM (Phase 2)** | `/phase2/custom-crm` | Locked sidebar entry opening dialog: "Not in phase 1". |

---

## 2. Architectural Decisions & Design Decisions

1. **Deterministic PRNG Engine (`src/utils/seededRandom.ts`)**:
   - Built with a Mulberry32 algorithm keyed to workspace identifiers. All seeded leads, scores, timestamps, and numbers produce identical values across page loads and match dynamically across all table views and dashboard widgets.
2. **Deterministic Data Scoping (`Show data scope`)**:
   - Every data model carries an explicit `workspace_id`. The footer toggle activates a database inspector displaying the active scope and PostgreSQL table name.
3. **Glassmorphism Design System**:
   - Three surface levels: Level 1 panels (`rgba(255,255,255,0.55)` / `rgba(18,24,34,0.55)` with 20px blur), Level 2 modals/drawers (`0.72` opacity with 32px blur), and dense surfaces (`0.85` opacity) for readable tabular data.
   - Fixed, static soft mesh background without purple/pink gradients or animated distractions.
   - Text contrast meets or exceeds WCAG 4.5:1.
4. **Role-Based Access Control (RBAC)**:
   - Supports 4 personas: Owner, Admin, Operator, Viewer.
   - Non-permitted actions for the Viewer role are gracefully disabled with an explanatory tooltip.
5. **Simulated Latency & Error Handling**:
   - Actions simulate asynchronous server roundtrips between 300ms and 900ms with skeleton loaders and spinner feedback.
   - Includes realistic failures: a retried execution run, a dead-letter quarantine record, and a hard bounce notification.

---

## 3. End-to-End Guided Architecture Tour

The demo includes an automated 11-step walkthrough triggered via **"Play end-to-end flow"**:
1. **Campaign Instruction**: AI Command Center prompt input.
2. **Approval Gate**: Human verification and risk signoff.
3. **Lead Acquisition**: Querying Apollo criteria for 100 prospects.
4. **Enrichment & Verification**: Ingestion into Supabase with ZeroBounce verification.
5. **CRM Entry**: Automated deal population into the CRM "Lead" stage.
6. **AI Personalization**: Tier 2 LLM hook synthesis per prospect.
7. **Outreach Dispatch**: n8n multi-channel dispatch respecting inbox limits.
8. **Follow-up Engine**: 48-hour wait timers and reply webhook listening.
9. **Inbound Reply**: Ingestion of a positive response from Dr. Arthur Bauer.
10. **CRM Update**: Kanban card automatically advances to "Appointment".
11. **Reporting & ROI**: Dashboard and unit economics metrics dynamically updated.

---

## 4. Run, Build, and Deployment Instructions

### Prerequisites
- Node.js 20 or higher
- npm 10 or higher

### Local Development
```bash
npm install
npm run dev
```

### Static Production Build
```bash
npm run build
```
The output is written to `/dist` and works as an unauthenticated static site on any static file host.

### Local Preview
```bash
npm run preview
```
Visit `http://localhost:4173/` or deep link to any route such as `/data/leads` or `/data/crm`.

### Deployment to Vercel
1. Ensure your repository contains `vercel.json` (already pre-configured with client-side rewrites and `noindex` headers).
2. Connect your GitHub repository to Vercel.
3. Configure the build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Node.js Version**: `20.x`
4. Deploy. No environment variables or external API keys are required.
