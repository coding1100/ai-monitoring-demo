import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useDemoStore } from '../../store/useDemoStore';
import { DiagramChip } from '../common/DiagramChip';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const startTour = useDemoStore((state) => state.startTour);
  const tourActive = useDemoStore((state) => state.tourActive);

  // Map route to diagram chip reference and page title
  const getRouteInfo = (pathname: string): { title: string; chip: string; type: 'built' | 'bought' | 'database' } => {
    switch (pathname) {
      case '/':
        return { title: 'Architecture System Map', chip: '00 Architecture Diagram', type: 'built' };
      case '/control/operator':
        return { title: 'Operator Cockpit', chip: '01 Control / Operator', type: 'built' };
      case '/control/command-center':
        return { title: 'AI Command Center', chip: '01 Control / AI command center', type: 'built' };
      case '/control/approval-gate':
        return { title: 'Human-in-the-Loop Approval Gate', chip: '01 Control / Approval gate', type: 'built' };
      case '/orchestration/runs':
        return { title: 'n8n Workflow Execution Runs', chip: '02 Orchestration / n8n orchestrator', type: 'built' };
      case '/orchestration/llm-router':
        return { title: 'LLM Task Router & Tier Matrix', chip: '02 Orchestration / LLM router', type: 'built' };
      case '/orchestration/openai':
        return { title: 'OpenAI API Connections & Keys', chip: '02 Orchestration / OpenAI API', type: 'bought' };
      case '/orchestration/rules':
        return { title: 'Code-Enforced Guardrails & Decision Log', chip: '02 Orchestration / Rules in code', type: 'built' };
      case '/workflows/b2b-leads':
        return { title: 'B2B Leads Campaign Builder & Scoring', chip: '03 Workflows / B2B leads / Apollo', type: 'built' };
      case '/workflows/b2c-capture':
        return { title: 'B2C Inbound Forms & Webhook Ingestion', chip: '03 Workflows / B2C capture / Meta Ads', type: 'built' };
      case '/workflows/email-sequences':
        return { title: 'Email Cadences, Inboxes & Reply Parser', chip: '03 Workflows / Email sequences / Instantly', type: 'built' };
      case '/workflows/sms':
        return { title: 'SMS Outreach & 10DLC Compliance', chip: '03 Workflows / SMS / Twilio', type: 'built' };
      case '/workflows/social':
        return { title: 'Social Calendar & Content Generator', chip: '03 Workflows / Social (Conditional)', type: 'built' };
      case '/workflows/follow-up':
        return { title: 'Follow-Up Engine & State Machine', chip: '03 Workflows / Follow-up engine', type: 'built' };
      case '/data/leads':
        return { title: 'Supabase Leads Database', chip: '04 Data / Supabase (PostgreSQL)', type: 'database' };
      case '/data/crm':
        return { title: 'CRM Kanban Pipeline & Sync', chip: '04 Data / CRM (HubSpot / GoHighLevel)', type: 'bought' };
      case '/data/suppression':
        return { title: 'Global Suppression & Opt-Out Registry', chip: '04 Data / Suppression list', type: 'database' };
      case '/data/logs':
        return { title: 'System Execution Logs & Audit Trail', chip: '04 Data / Logs & Audit', type: 'database' };
      case '/output/dashboard':
        return { title: 'Executive Operations Dashboard', chip: '05 Output / Dashboard', type: 'built' };
      case '/output/costs':
        return { title: 'Unit Economics & Token Expenditure', chip: '05 Output / Costs', type: 'built' };

      // Agency Admin Screens
      case '/agency/overview':
        return { title: 'Agency Operations Overview', chip: '05 Output / Agency Hub', type: 'built' };
      case '/agency/workspaces':
        return { title: 'Client Workspaces Directory', chip: '01 Control / Multi-Tenant Directory', type: 'built' };
      case '/agency/usage-cost':
        return { title: 'Token Telemetry & Margins', chip: '05 Output / Unit Economics', type: 'built' };
      case '/agency/pricing-forecast':
        return { title: 'Pricing & Forecast Projections', chip: '05 Output / Forecasting', type: 'built' };
      case '/agency/billing':
        return { title: 'Agency Billing & Stripe Dunning', chip: '05 Output / Billing Gateway', type: 'bought' };
      case '/agency/gohighlevel':
        return { title: 'GoHighLevel Sub-Accounts & Mapping', chip: '04 Data / GHL Gateway', type: 'bought' };
      case '/agency/team':
        return { title: 'Agency Team & Access Governance', chip: '01 Control / Agency Access', type: 'built' };
      case '/agency/health':
        return { title: 'System Health & Orchestration Alerts', chip: '02 Orchestration / Telemetry', type: 'built' };
      case '/agency/isolation':
        return { title: 'Workspace Isolation & RLS Security', chip: '04 Data / Security Boundary', type: 'database' };

      // Client Workspace Screens
      case '/client/home':
        return { title: 'Workspace Operations Hub', chip: '05 Output / Client Hub', type: 'built' };
      case '/client/reports':
        return { title: 'Performance Reports & Digests', chip: '05 Output / Reporting', type: 'built' };
      case '/client/plan-usage':
        return { title: 'Plan & Usage Resource Meters', chip: '05 Output / Resource Meters', type: 'built' };
      case '/client/team':
        return { title: 'Workspace Team & Access', chip: '01 Control / Workspace Team', type: 'built' };
      case '/client/integrations':
        return { title: 'Integrations & Service Connectors', chip: '03 Workflows / Connections', type: 'bought' };
      case '/client/website-integration':
        return { title: 'Website Integration & Inbound Forms', chip: '03 Workflows / Inbound Capture', type: 'built' };

      // Legacy / Auth / Onboarding
      case '/workspace/integrations':
        return { title: 'Workspace Third-Party Connections', chip: 'Workspace / Integrations', type: 'bought' };
      case '/workspace/team':
        return { title: 'Team Members & RBAC Permissions', chip: 'Workspace / Team and roles', type: 'built' };
      case '/workspace/usage':
        return { title: 'Plan Allocation & Resource Meters', chip: 'Workspace / Plan & usage', type: 'built' };
      case '/workspace/settings':
        return { title: 'Workspace Operational Parameters', chip: 'Workspace / Settings', type: 'built' };
      case '/onboarding':
        return { title: 'Workspace Onboarding Wizard', chip: 'Auth / Onboarding Checklist', type: 'built' };
      case '/auth/login':
        return { title: 'Sign In to Workspace', chip: 'Auth / Login', type: 'built' };
      case '/auth/register':
        return { title: 'Create Organization', chip: 'Auth / Register', type: 'built' };
      default:
        return { title: 'Platform Management', chip: 'Architecture Demo', type: 'built' };
    }
  };

  const routeInfo = getRouteInfo(location.pathname);

  const handleStartGuidedFlow = () => {
    navigate('/control/command-center');
    startTour();
  };

  return (
    <header className="h-14 px-6 shrink-0 glass-dense border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate m-0">
          {routeInfo.title}
        </h1>
        <DiagramChip reference={routeInfo.chip} type={routeInfo.type} />
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {!tourActive && (
          <button
            onClick={handleStartGuidedFlow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-control bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-150 active:translate-y-[1px]"
            title="Starts the 18-step interactive tour traversing all architecture components"
          >
            <Play className="w-3.5 h-3.5 fill-current" strokeWidth={1.5} />
            <span>Play end-to-end flow</span>
          </button>
        )}
      </div>
    </header>
  );
};
