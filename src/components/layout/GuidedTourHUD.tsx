import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useDemoStore } from '../../store/useDemoStore';
import { GUIDED_TOUR_STEPS } from '../../data/guidedTourSteps';

export const GuidedTourHUD: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tourActive = useDemoStore((state) => state.tourActive);
  const tourStepIndex = useDemoStore((state) => state.tourStepIndex);
  const tourPaused = useDemoStore((state) => state.tourPaused);
  const nextTourStep = useDemoStore((state) => state.nextTourStep);
  const prevTourStep = useDemoStore((state) => state.prevTourStep);
  const togglePauseTour = useDemoStore((state) => state.togglePauseTour);
  const endTour = useDemoStore((state) => state.endTour);

  // Domain mutations
  const updateLeadStage = useDemoStore((state) => state.updateLeadStage);
  const addReply = useDemoStore((state) => state.addReply);
  const addLead = useDemoStore((state) => state.addLead);
  const leads = useDemoStore((state) => state.leads);
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);

  const currentStep = GUIDED_TOUR_STEPS[tourStepIndex] || GUIDED_TOUR_STEPS[0];
  const isLast = tourStepIndex >= GUIDED_TOUR_STEPS.length - 1;

  // Auto-navigate to step's route when step changes
  useEffect(() => {
    if (tourActive && currentStep) {
      if (currentStep.route.startsWith('/agency')) {
        useDemoStore.getState().setAppMode('agency');
      } else if (currentStep.route.startsWith('/client')) {
        useDemoStore.getState().setAppMode('client');
      }

      if (location.pathname !== currentStep.route) {
        navigate(currentStep.route);
      }

      // Execute real-time data mutations matching the flow:
      if (tourStepIndex === 2) {
        // Step 2: Lead acquisition - ensure an extra qualified lead is ingested
        const exists = leads.some((l) => l.fullName === 'Dr. Kimberly Ross');
        if (!exists) {
          addLead({
            id: `lead_${currentWorkspaceId}_guided_99`,
            workspace_id: currentWorkspaceId,
            fullName: 'Dr. Kimberly Ross',
            email: 'k.ross@tribeca-aesthetics.com',
            phone: '+1 (212) 555-0819',
            title: 'Medical Director',
            company: 'Tribeca Aesthetics Clinic',
            location: 'New York, NY',
            source: 'apollo_b2b',
            stage: 'Lead',
            score: 95,
            scoreReason: 'Apollo direct match: 3 certified providers, high margin laser services',
            consent: { status: 'opted_in', date: '2026-03-28', source: 'Apollo B2B Match' },
            tags: ['guided_flow', 'high_ticket', 'medspa_owner'],
            timeline: [
              {
                id: 'tl_g_1',
                date: '2026-03-28 10:20',
                type: 'form_submit',
                title: 'Lead Ingested via Apollo B2B criteria',
                note: 'Acquired during guided tour run.',
              },
            ],
            updatedAt: '2026-03-28 10:20',
          });
        }
      } else if (tourStepIndex === 8) {
        // Step 8: Inbound response arrives
        const tourReplyExists = useDemoStore
          .getState()
          .replies.some((r) => r.id === 'rep_tour_live');
        if (!tourReplyExists) {
          addReply({
            id: 'rep_tour_live',
            workspace_id: currentWorkspaceId,
            leadName: 'Dr. Arthur Bauer',
            fromEmail: 'dr.bauer@manhattanderma.com',
            subject: 'Re: Quick question regarding clinical workflow',
            body: 'Hi Marcus, thanks for the benchmark teardown. Can you meet this Thursday at 2pm for a 15-minute walkthrough?',
            receivedAt: 'Just now',
            sentiment: 'positive',
            campaignName: 'NYC Med Spa Owner Direct Cadence',
            handled: false,
          });
        }
      } else if (tourStepIndex === 9) {
        // Step 9: CRM update - advance card to Appointment
        const bauerLead = leads.find(
          (l) => l.fullName.includes('Bauer') && l.workspace_id === currentWorkspaceId
        );
        if (bauerLead && bauerLead.stage !== 'Appointment') {
          updateLeadStage(bauerLead.id, 'Appointment');
        }
      }
    }
  }, [tourActive, tourStepIndex]);

  // Optional auto-play ticker when not paused
  useEffect(() => {
    if (!tourActive || tourPaused || isLast) return;

    const timer = setTimeout(() => {
      nextTourStep();
    }, 7000); // 7s auto advance

    return () => clearTimeout(timer);
  }, [tourActive, tourStepIndex, tourPaused, isLast]);

  if (!tourActive) return null;

  return (
    <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-fade-in pointer-events-auto">
      <div className="glass-modal p-4 border border-blue-500/30 dark:border-blue-400/30 shadow-2xl rounded-panel">
        {/* Top Header inside HUD */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-700 dark:text-blue-300 font-semibold">
              End-to-End Guided Architecture Tour
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
              Step {tourStepIndex + 1} of {GUIDED_TOUR_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={togglePauseTour}
              className="p-1 rounded-[6px] hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300"
              title={tourPaused ? 'Resume auto-play' : 'Pause auto-play'}
            >
              {tourPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={endTour}
              className="p-1 rounded-[6px] hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300"
              title="Exit tour"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Body Narration */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {currentStep.stepName}: {currentStep.title}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-slate-200/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400">
                {currentStep.diagramChip}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-1.5">
              {currentStep.description}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>System Action: {currentStep.systemActionSummary}</span>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-2 shrink-0 justify-end">
            <button
              onClick={prevTourStep}
              disabled={tourStepIndex === 0}
              className="px-2.5 py-1.5 text-xs font-medium rounded-control bg-slate-200/70 dark:bg-slate-800/70 hover:bg-slate-300/70 dark:hover:bg-slate-700/70 text-slate-800 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {isLast ? (
              <button
                onClick={endTour}
                className="px-3 py-1.5 text-xs font-medium rounded-control bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center gap-1 shadow-sm transition-colors"
              >
                <span>Finish</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={nextTourStep}
                className="px-3 py-1.5 text-xs font-medium rounded-control bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-1 shadow-sm transition-colors"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
