import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

// Home
import { HomeMap } from './pages/HomeMap';

// Auth & Onboarding
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { OnboardingPage } from './pages/auth/OnboardingPage';
import { NotFoundPage } from './pages/NotFoundPage';

// 01 Control
import { OperatorPage } from './pages/control/OperatorPage';
import { CommandCenterPage } from './pages/control/CommandCenterPage';
import { ApprovalGatePage } from './pages/control/ApprovalGatePage';

// 02 Orchestration
import { OrchestratorRunsPage } from './pages/orchestration/OrchestratorRunsPage';
import { LlmRouterPage } from './pages/orchestration/LlmRouterPage';
import { OpenAiPage } from './pages/orchestration/OpenAiPage';
import { RulesInCodePage } from './pages/orchestration/RulesInCodePage';

// 03 Workflows
import { B2bLeadsPage } from './pages/workflows/B2bLeadsPage';
import { B2cCapturePage } from './pages/workflows/B2cCapturePage';
import { EmailSequencesPage } from './pages/workflows/EmailSequencesPage';
import { SmsPage } from './pages/workflows/SmsPage';
import { SocialPage } from './pages/workflows/SocialPage';
import { FollowUpEnginePage } from './pages/workflows/FollowUpEnginePage';

// 04 Data
import { LeadsDataPage } from './pages/data/LeadsDataPage';
import { CrmKanbanPage } from './pages/data/CrmKanbanPage';
import { SuppressionPage } from './pages/data/SuppressionPage';
import { LogsPage } from './pages/data/LogsPage';

// 05 Output
import { DashboardPage } from './pages/output/DashboardPage';
import { CostsPage } from './pages/output/CostsPage';

// Workspace
import { IntegrationsPage } from './pages/workspace/IntegrationsPage';
import { TeamRolesPage } from './pages/workspace/TeamRolesPage';
import { PlanUsagePage } from './pages/workspace/PlanUsagePage';
import { WorkspaceSettingsPage } from './pages/workspace/WorkspaceSettingsPage';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
