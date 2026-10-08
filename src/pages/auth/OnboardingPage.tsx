import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoStore } from '../../store/useDemoStore';
import {
  CheckCircle2,
  Circle,
  CreditCard,
  Building,
  Layers,
  Link2,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { PlanTier } from '../../types';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    onboarding,
    setOnboardingStep,
    updateOnboardingAccount,
    setOnboardingPlan,
    updateOnboardingPayment,
    toggleOnboardingIntegration,
    tickOnboardingCrmCheck,
    toggleOnboardingCampaignCheck,
    finishOnboarding,
    planDefinitions,
  } = useDemoStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Automated self-ticking simulation for Step 5 CRM sync
  useEffect(() => {
    if (onboarding.step === 5) {
      const timers: Array<ReturnType<typeof setTimeout>> = [];
      const keys: Array<keyof typeof onboarding.crmChecklist> = [
        'subAccountCreated',
        'pipelinesMapped',
        'contactsSynced',
        'webhooksBound',
      ];

      keys.forEach((key, idx) => {
        if (!onboarding.crmChecklist[key]) {
          const t = setTimeout(() => {
            tickOnboardingCrmCheck(key);
          }, (idx + 1) * 600);
          timers.push(t);
        }
      });

      return () => {
        timers.forEach(clearTimeout);
      };
    }
  }, [onboarding.step, onboarding.crmChecklist, tickOnboardingCrmCheck]);

  const selectedPlan =
    planDefinitions.find((p) => p.name === onboarding.plan) || planDefinitions[1];

  const handleStepSubmit = (nextStep: number) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOnboardingStep(nextStep);
    }, 350);
  };

  const handleFinalFinish = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newWsId = finishOnboarding();
      setIsProcessing(false);
      navigate('/client/home');
    }, 600);
  };

  const stepsHeader = [
    { num: 1, title: 'Account' },
    { num: 2, title: 'Plan' },
    { num: 3, title: 'Payment' },
    { num: 4, title: 'Connect' },
    { num: 5, title: 'CRM Sync' },
    { num: 6, title: 'Campaign' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-[10px] bg-blue-600 px-4 py-2.5 text-xs font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Wizard Navigation */}
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-600" />
            <span className="font-mono text-xs font-semibold tracking-wider text-slate-900 dark:text-white uppercase">
              Client Workspace Provisioning Wizard
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono text-xs text-slate-400">
            <span>Step {onboarding.step} of 6</span>
          </div>
        </div>

        {/* Step Breadcrumbs */}
        <div className="mt-4 flex items-center justify-between gap-1 overflow-x-auto pb-2">
          {stepsHeader.map((s) => {
            const isCompleted = s.num < onboarding.step;
            const isCurrent = s.num === onboarding.step;

            return (
              <button
                key={s.num}
                onClick={() => {
                  if (s.num <= onboarding.step) {
                    setOnboardingStep(s.num);
                  }
                }}
                disabled={s.num > onboarding.step}
                className={`flex items-center gap-2 rounded-[8px] px-3 py-1.5 text-xs font-medium transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-xs'
                    : isCompleted
                    ? 'text-slate-700 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-800'
                    : 'text-slate-400 cursor-not-allowed opacity-50'
                }`}
              >
                <span
                  className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-white text-blue-600'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-300 dark:bg-slate-700 text-slate-600'
                  }`}
                >
                  {isCompleted ? '✓' : s.num}
                </span>
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="mx-auto w-full max-w-4xl my-8">
        <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-6 sm:p-8 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
          {/* STEP 1: Account Information */}
          {onboarding.step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="rounded-[6px] bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  Step 1 / 6
                </span>
                <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                  Account & Organization Details
                </h1>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Configure your primary administrative account and workspace identity.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={onboarding.account.fullName}
                    onChange={(e) => updateOnboardingAccount({ fullName: e.target.value })}
                    className="mt-1 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300">
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={onboarding.account.workEmail}
                    onChange={(e) => updateOnboardingAccount({ workEmail: e.target.value })}
                    className="mt-1 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300">
                    Company / Practice Name
                  </label>
                  <input
                    type="text"
                    required
                    value={onboarding.account.companyName}
                    onChange={(e) => updateOnboardingAccount({ companyName: e.target.value })}
                    className="mt-1 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300">
                    Industry Vertical
                  </label>
                  <select
                    value={onboarding.account.industry}
                    onChange={(e) => updateOnboardingAccount({ industry: e.target.value })}
                    className="mt-1 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Medical Aesthetics">Medical Aesthetics & Dermatology</option>
                    <option value="Dental Healthcare">Dental Healthcare & Orthodontics</option>
                    <option value="Commercial Roofing">Commercial Roofing & Contracting</option>
                    <option value="Legal Services">Legal Services & Corporate Law</option>
                    <option value="Clean Energy">Clean Energy & Commercial Solar</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => handleStepSubmit(2)}
                  disabled={isProcessing}
                  className="flex items-center gap-2 rounded-[10px] bg-blue-600 px-5 py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-blue-700"
                >
                  <span>Select Subscription Plan</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Plan Selection */}
          {onboarding.step === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <span className="rounded-[6px] bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    Step 2 / 6
                  </span>
                  <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                    Select Your Prospecting Tier
                  </h1>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Volume limits scale with your active client acquisition pipeline.
                  </p>
                </div>

                {/* Billing cycle toggle */}
                <div className="flex items-center gap-2 rounded-[10px] bg-slate-100 p-1 dark:bg-slate-800 self-start sm:self-auto text-xs">
                  <button
                    onClick={() => setOnboardingPlan(onboarding.plan, 'monthly')}
                    className={`rounded-[8px] px-3 py-1 font-medium transition-all ${
                      onboarding.billingCycle === 'monthly'
                        ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setOnboardingPlan(onboarding.plan, 'yearly')}
                    className={`rounded-[8px] px-3 py-1 font-medium transition-all ${
                      onboarding.billingCycle === 'yearly'
                        ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Yearly (-20%)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {planDefinitions.map((plan) => {
                  const isSelected = onboarding.plan === plan.name;
                  const price =
                    onboarding.billingCycle === 'yearly'
                      ? Math.round(plan.price * 0.8)
                      : plan.price;

                  return (
                    <div
                      key={plan.name}
                      onClick={() => setOnboardingPlan(plan.name, onboarding.billingCycle)}
                      className={`cursor-pointer rounded-[12px] border p-5 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 shadow-sm dark:border-blue-500 dark:bg-blue-950/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-slate-800/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {plan.name}
                          </span>
                          {isSelected && (
                            <span className="rounded-full bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5">
                              Selected
                            </span>
                          )}
                        </div>

                        <div className="mt-3 font-mono">
                          <span className="text-2xl font-bold text-slate-900 dark:text-white">
                            ${price}
                          </span>
                          <span className="text-xs text-slate-400"> /mo</span>
                        </div>

                        <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                          <li>• {plan.leads.toLocaleString()} verified leads /mo</li>
                          <li>• {plan.emails.toLocaleString()} outbound emails /mo</li>
                          <li>• {plan.sms.toLocaleString()} SMS segments /mo</li>
                          <li>• {plan.posts} social posts</li>
                          <li>• {plan.seats} team seats</li>
                        </ul>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-white/5 text-[11px] font-mono text-slate-400">
                        Included AI: ${(plan.price * 0.35).toFixed(0)} cap
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setOnboardingStep(1)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <button
                  onClick={() => handleStepSubmit(3)}
                  className="flex items-center gap-2 rounded-[10px] bg-blue-600 px-5 py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-blue-700"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {onboarding.step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="rounded-[6px] bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  Step 3 / 6
                </span>
                <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                  Payment Authorization
                </h1>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Secure checkout powered by Stripe. Pre-filled with sandbox test card ending in 4242.
                </p>
              </div>

              {/* Sandbox info alert */}
              <div className="rounded-[10px] border border-blue-500/20 bg-blue-500/5 p-3 flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                <ShieldCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span>
                  Test Sandbox Mode Active: Real charges are disabled. Use the provided 4242 test token.
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={onboarding.payment.cardName}
                    onChange={(e) => updateOnboardingPayment({ cardName: e.target.value })}
                    className="mt-1 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300">
                    Card Number
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      value={onboarding.payment.cardNumber}
                      onChange={(e) => updateOnboardingPayment({ cardNumber: e.target.value })}
                      className="w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 pl-9 font-mono text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
                    />
                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300">
                      Expiration
                    </label>
                    <input
                      type="text"
                      value={onboarding.payment.cardExp}
                      onChange={(e) => updateOnboardingPayment({ cardExp: e.target.value })}
                      className="mt-1 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300">
                      CVC
                    </label>
                    <input
                      type="password"
                      value={onboarding.payment.cardCvc}
                      onChange={(e) => updateOnboardingPayment({ cardCvc: e.target.value })}
                      className="mt-1 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={onboarding.payment.postalCode}
                      onChange={(e) => updateOnboardingPayment({ postalCode: e.target.value })}
                      className="mt-1 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setOnboardingStep(2)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <button
                  onClick={() => handleStepSubmit(4)}
                  disabled={isProcessing}
                  className="flex items-center gap-2 rounded-[10px] bg-blue-600 px-5 py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-blue-700"
                >
                  <span>Authorize ${selectedPlan.price}/mo & Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Connect Accounts */}
          {onboarding.step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="rounded-[6px] bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  Step 4 / 6
                </span>
                <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                  Connect Service Channels
                </h1>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Select outreach channels to provision for this workspace. Keys are managed by agency pools.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'email', name: 'Email Outreach Engine (Instantly)', desc: 'Dedicated cold inbox sending pool with automated warming' },
                  { key: 'sms', name: 'SMS Gateway (Twilio 10DLC)', desc: 'Pre-registered conversational SMS numbers with carrier compliance' },
                  { key: 'crm', name: 'GoHighLevel / CRM Sync', desc: 'Automatic sub-account creation and bidirectional pipeline mapping' },
                  { key: 'apollo', name: 'Apollo Lead Intelligence', desc: 'Automated decision-maker enrichment and email address verification' },
                  { key: 'meta', name: 'Meta Lead Webhooks', desc: 'Real-time ingestion of Instagram and Facebook ad inquiries' },
                ].map((item) => {
                  const isChecked = Boolean(onboarding.integrations[item.key as keyof typeof onboarding.integrations]);

                  return (
                    <div
                      key={item.key}
                      onClick={() => toggleOnboardingIntegration(item.key)}
                      className="cursor-pointer rounded-[10px] border border-slate-200 p-4 flex items-center justify-between hover:bg-slate-50 dark:border-white/10 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div>
                        <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.desc}
                        </p>
                      </div>

                      <div
                        className={`h-5 w-5 rounded-[6px] border flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {isChecked && <Check className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setOnboardingStep(3)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <button
                  onClick={() => handleStepSubmit(5)}
                  className="flex items-center gap-2 rounded-[10px] bg-blue-600 px-5 py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-blue-700"
                >
                  <span>Proceed to CRM Sync</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: CRM Sync Self-Ticking Checklist */}
          {onboarding.step === 5 && (
            <div className="space-y-6">
              <div>
                <span className="rounded-[6px] bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  Step 5 / 6
                </span>
                <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                  CRM Sub-Account Synchronization
                </h1>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Provisioning sub-account location and syncing pipeline properties in real time.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'subAccountCreated', title: 'Sub-account OAuth 2.0 handshake established', detail: 'Token verified against location loc_st8921xa' },
                  { key: 'pipelinesMapped', title: 'Two-way custom opportunity fields mapped', detail: 'lead_score, intent_signals, and stage aligned' },
                  { key: 'contactsSynced', title: 'Baseline contact directory synchronized', detail: '1,240 contact records mirrored in Supabase cache' },
                  { key: 'webhooksBound', title: 'Bidirectional webhook subscriptions active', detail: 'Listening to inbound replies and status mutations' },
                ].map((item) => {
                  const isDone = Boolean(onboarding.crmChecklist[item.key as keyof typeof onboarding.crmChecklist]);

                  return (
                    <div
                      key={item.key}
                      className={`rounded-[10px] border p-4 flex items-center justify-between transition-all ${
                        isDone
                          ? 'border-emerald-500/30 bg-emerald-50/20 dark:border-emerald-500/20 dark:bg-emerald-950/10'
                          : 'border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center ${
                            isDone
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                          }`}
                        >
                          {isDone ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <RefreshCw className="h-3 w-3 animate-spin text-blue-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            {item.detail}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`font-mono text-[11px] font-semibold ${
                          isDone
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-blue-600 dark:text-blue-400 animate-pulse'
                        }`}
                      >
                        {isDone ? 'COMPLETE' : 'SYNCING...'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setOnboardingStep(4)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <button
                  onClick={() => handleStepSubmit(6)}
                  className="flex items-center gap-2 rounded-[10px] bg-blue-600 px-5 py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-blue-700"
                >
                  <span>Continue to First Campaign</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: First Campaign Checklist */}
          {onboarding.step === 6 && (
            <div className="space-y-6">
              <div>
                <span className="rounded-[6px] bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  Step 6 / 6
                </span>
                <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                  First Campaign Readiness Checklist
                </h1>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Final pre-flight safety audit before opening your active Client Hub.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'personasDefined', title: 'Target Audience Criteria Configured', desc: '100 qualified decision makers in target geography' },
                  { key: 'sequenceDrafted', title: 'Multi-Touch Outreach Sequence Ready', desc: '3 contextual emails + 1 adaptive SMS touch point' },
                  { key: 'guardrailsVerified', title: 'Safety Guardrails & Spending Cap Active', desc: 'Daily token expenditure constrained to budget ceiling' },
                  { key: 'launchReady', title: 'Autonomous Execution Authorized', desc: 'System approval gate cleared for outbound dispatch' },
                ].map((item) => {
                  const isChecked = Boolean(onboarding.campaignChecklist[item.key as keyof typeof onboarding.campaignChecklist]);

                  return (
                    <div
                      key={item.key}
                      onClick={() => toggleOnboardingCampaignCheck(item.key as any)}
                      className="cursor-pointer rounded-[10px] border border-slate-200 p-4 flex items-center justify-between hover:bg-slate-50 dark:border-white/10 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div>
                        <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.desc}
                        </p>
                      </div>

                      <div
                        className={`h-5 w-5 rounded-[6px] border flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {isChecked && <Check className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setOnboardingStep(5)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <button
                  onClick={handleFinalFinish}
                  disabled={isProcessing}
                  className="flex items-center gap-2 rounded-[10px] bg-emerald-600 px-6 py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-emerald-700"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isProcessing ? 'Finalizing Workspace...' : 'Launch Campaign & Open Client Hub'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center font-mono text-[11px] text-slate-400">
        Demo state saved in localStorage • Static client-side simulation
      </div>
    </div>
  );
};
