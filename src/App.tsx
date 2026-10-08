import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

// Home
const HomeMap = lazy(() => import('./pages/HomeMap').then(m => ({ default: m.HomeMap })));

// Auth & Onboarding
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const OnboardingPage = lazy(() => import('./pages/auth/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// 01 Control
const OperatorPage = lazy(() => import('./pages/control/OperatorPage').then(m => ({ default: m.OperatorPage })));
const CommandCenterPage = lazy(() => import('./pages/control/CommandCenterPage').then(m => ({ default: m.CommandCenterPage })));
const ApprovalGatePage = lazy(() => import('./pages/control/ApprovalGatePage').then(m => ({ default: m.ApprovalGatePage })));

// 02 Orchestration
const OrchestratorRunsPage = lazy(() => import('./pages/orchestration/OrchestratorRunsPage').then(m => ({ default: m.OrchestratorRunsPage })));
const LlmRouterPage = lazy(() => import('./pages/orchestration/LlmRouterPage').then(m => ({ default: m.LlmRouterPage })));
const OpenAiPage = lazy(() => import('./pages/orchestration/OpenAiPage').then(m => ({ default: m.OpenAiPage })));
const RulesInCodePage = lazy(() => import('./pages/orchestration/RulesInCodePage').then(m => ({ default: m.RulesInCodePage })));

// 03 Workflows
const B2bLeadsPage = lazy(() => import('./pages/workflows/B2bLeadsPage').then(m => ({ default: m.B2bLeadsPage })));
const B2cCapturePage = lazy(() => import('./pages/workflows/B2cCapturePage').then(m => ({ default: m.B2cCapturePage })));
const EmailSequencesPage = lazy(() => import('./pages/workflows/EmailSequencesPage').then(m => ({ default: m.EmailSequencesPage })));
const SmsPage = lazy(() => import('./pages/workflows/SmsPage').then(m => ({ default: m.SmsPage })));
const SocialPage = lazy(() => import('./pages/workflows/SocialPage').then(m => ({ default: m.SocialPage })));
const FollowUpEnginePage = lazy(() => import('./pages/workflows/FollowUpEnginePage').then(m => ({ default: m.FollowUpEnginePage })));

// 04 Data
const LeadsDataPage = lazy(() => import('./pages/data/LeadsDataPage').then(m => ({ default: m.LeadsDataPage })));
const CrmKanbanPage = lazy(() => import('./pages/data/CrmKanbanPage').then(m => ({ default: m.CrmKanbanPage })));
const SuppressionPage = lazy(() => import('./pages/data/SuppressionPage').then(m => ({ default: m.SuppressionPage })));
const LogsPage = lazy(() => import('./pages/data/LogsPage').then(m => ({ default: m.LogsPage })));

// 05 Output
const DashboardPage = lazy(() => import('./pages/output/DashboardPage').then(m => ({ default: m.DashboardPage })));
const CostsPage = lazy(() => import('./pages/output/CostsPage').then(m => ({ default: m.CostsPage })));

// Workspace
const IntegrationsPage = lazy(() => import('./pages/workspace/IntegrationsPage').then(m => ({ default: m.IntegrationsPage })));
const TeamRolesPage = lazy(() => import('./pages/workspace/TeamRolesPage').then(m => ({ default: m.TeamRolesPage })));
const PlanUsagePage = lazy(() => import('./pages/workspace/PlanUsagePage').then(m => ({ default: m.PlanUsagePage })));
const WorkspaceSettingsPage = lazy(() => import('./pages/workspace/WorkspaceSettingsPage').then(m => ({ default: m.WorkspaceSettingsPage })));

const RouteLoadingFallback = () => (
  <div className="space-y-4 animate-pulse p-6">
    <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
    <div className="h-4 w-96 bg-slate-200 dark:bg-slate-800 rounded" />
    <div className="h-64 w-full bg-slate-200 dark:bg-slate-800 rounded-panel mt-6" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Home System Map */}
            <Route path="/" element={<HomeMap />} />

            {/* 01 Control */}
            <Route path="/control/operator" element={<OperatorPage />} />
            <Route path="/control/command-center" element={<CommandCenterPage />} />
            <Route path="/control/approval-gate" element={<ApprovalGatePage />} />

            {/* 02 Orchestration */}
            <Route path="/orchestration/runs" element={<OrchestratorRunsPage />} />
            <Route path="/orchestration/llm-router" element={<LlmRouterPage />} />
            <Route path="/orchestration/openai" element={<OpenAiPage />} />
            <Route path="/orchestration/rules" element={<RulesInCodePage />} />

            {/* 03 Workflows */}
            <Route path="/workflows/b2b-leads" element={<B2bLeadsPage />} />
            <Route path="/workflows/b2c-capture" element={<B2cCapturePage />} />
            <Route path="/workflows/email-sequences" element={<EmailSequencesPage />} />
            <Route path="/workflows/sms" element={<SmsPage />} />
            <Route path="/workflows/social" element={<SocialPage />} />
            <Route path="/workflows/follow-up" element={<FollowUpEnginePage />} />

            {/* 04 Data */}
            <Route path="/data/leads" element={<LeadsDataPage />} />
            <Route path="/data/crm" element={<CrmKanbanPage />} />
            <Route path="/data/suppression" element={<SuppressionPage />} />
            <Route path="/data/logs" element={<LogsPage />} />

            {/* 05 Output */}
            <Route path="/output/dashboard" element={<DashboardPage />} />
            <Route path="/output/costs" element={<CostsPage />} />

            {/* Workspace */}
            <Route path="/workspace/integrations" element={<IntegrationsPage />} />
            <Route path="/workspace/team" element={<TeamRolesPage />} />
            <Route path="/workspace/usage" element={<PlanUsagePage />} />
            <Route path="/workspace/settings" element={<WorkspaceSettingsPage />} />

            {/* Auth & Onboarding */}
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
