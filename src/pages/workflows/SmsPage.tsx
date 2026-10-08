import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserX,
  FileText,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { fakeDelay } from '../../utils/seededRandom';

export const SmsPage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const smsRecords = useDemoStore((state) => state.smsRecords).filter((s) => s.workspace_id === currentWorkspaceId);
  const sendSms = useDemoStore((state) => state.sendSms);
  const suppressionList = useDemoStore((state) => state.suppressionList).filter(
    (s) => s.workspace_id === currentWorkspaceId && s.type === 'phone'
  );

  const [activeTab, setActiveTab] = useState<'composer' | 'templates' | 'conversations' | 'consent' | 'optouts'>('composer');

  // Composer state
  const [recipient, setRecipient] = useState('+1 (312) 555-0144');
  const [leadName, setLeadName] = useState('Michael Chang');
  const [messageBody, setMessageBody] = useState(
    'Hi Michael, friendly reminder for your appointment tomorrow at 10:00 AM with Dr. Mercer.'
  );
  const optOutLine = ' Reply STOP to cancel.';
  const fullMessage = `${messageBody}${optOutLine}`;

  const a2pStatus = currentWorkspaceId === 'ridgeway' ? 'pending' : 'approved';

  const handleSendSms = async () => {
    await fakeDelay(500);
    sendSms({
      id: `sms_${Date.now()}`,
      workspace_id: currentWorkspaceId,
      leadName,
      phone: recipient,
      direction: 'outbound',
      message: fullMessage,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'delivered',
    });
    setMessageBody('Hi Michael, thank you for confirming.');
  };

  const templates = [
    {
      title: 'Appointment 24h Reminder',
      body: 'Hi {{firstName}}, reminder for your consult tomorrow at {{time}} with {{provider}}. Reply C to confirm or R to reschedule. Reply STOP to cancel.',
      category: 'Transactional / Appointment',
    },
    {
      title: 'Instant Inbound Lead Booking',
      body: 'Hi {{firstName}}, thank you for reaching out! Book your consultation online here: https://book.demo/{{id}} Reply STOP to opt out.',
      category: 'Inbound Capture Nurture',
    },
    {
      title: 'Post-Visit Care & Review Request',
      body: 'Hi {{firstName}}, thanks for visiting us today! How was your experience? Leave a review or feedback here: https://review.demo/{{id}} Reply STOP to opt out.',
      category: 'Post-Consult Follow-up',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">03 WORKFLOWS</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">SMS</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            SMS Outreach & A2P 10DLC Compliance
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Twilio programmatic messaging, automated opt-out enforcement, appointment reminders, and conversation threads.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="sms_dispatches" count={smsRecords.length} />
          <DiagramChip reference="03 Workflows / SMS / Twilio" type="built" />
        </div>
      </div>

      {/* A2P 10DLC Status Banner */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-control ${a2pStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Twilio Messaging Service & A2P 10DLC
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                  a2pStatus === 'approved'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                }`}
              >
                10DLC {a2pStatus}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              Campaign ID: CP88290 | Brand ID: BR91024 | Carrier Throughput: 15 MPS
            </div>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500">
          Carrier surcharge: $0.003 / msg | Opt-out rate: 0.4%
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 glass-panel p-2">
        <button
          onClick={() => setActiveTab('composer')}
          className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
            activeTab === 'composer' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
          }`}
        >
          SMS Composer
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
            activeTab === 'templates' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
          }`}
        >
          Appointment Templates
        </button>
        <button
          onClick={() => setActiveTab('conversations')}
          className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
            activeTab === 'conversations' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
          }`}
        >
          Live SMS Thread ({smsRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('consent')}
          className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
            activeTab === 'consent' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
          }`}
        >
          Consent Audit Log
        </button>
        <button
          onClick={() => setActiveTab('optouts')}
          className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
            activeTab === 'optouts' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
          }`}
        >
          Opt-Out Registry ({suppressionList.length})
        </button>
      </div>

      {/* Tab 1: Composer with Character Count & Mandatory Opt-out line */}
      {activeTab === 'composer' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 glass-dense p-6 rounded-panel space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              Compose Direct SMS Dispatch
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phone (E.164 Format)
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Message Content
                </label>
                <span className="text-[11px] font-mono text-slate-500">
                  {fullMessage.length} / 160 characters (1 segment)
                </span>
              </div>
              <textarea
                rows={3}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                className="w-full p-3 text-xs font-mono rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-accent leading-relaxed"
              />
            </div>

            {/* Mandatory Opt-Out Line Suffix */}
            <div className="p-2.5 rounded-control bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300/40 dark:border-slate-700/40 text-[11px] font-mono text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span>Mandatory 10DLC Suffix: <strong>{optOutLine}</strong></span>
              <span className="text-emerald-600 text-[10px]">Appended automatically</span>
            </div>

            <div className="pt-2 flex justify-end">
              <ActionButton
                rbacAction="send_outreach"
                variant="primary"
                onAsyncClick={handleSendSms}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send SMS Message</span>
              </ActionButton>
            </div>
          </div>

          {/* Mobile Phone Mockup Preview */}
          <div className="md:col-span-5 flex justify-center">
            <div className="w-[280px] p-4 rounded-[28px] border-4 border-slate-300 dark:border-slate-700 glass-modal shadow-2xl space-y-3">
              <div className="w-20 h-3 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto" />
              <div className="text-center pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{leadName}</div>
                <div className="text-[10px] text-slate-500 font-mono">{recipient}</div>
              </div>

              <div className="space-y-2 py-4 min-h-[160px] flex flex-col justify-end">
                <div className="max-w-[85%] self-end p-2.5 rounded-2xl rounded-br-sm bg-accent text-white text-xs font-mono leading-relaxed">
                  {fullMessage}
                </div>
                <div className="text-[9px] text-slate-400 self-end font-mono">Delivered now</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Appointment Templates */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((tmpl, idx) => (
            <div key={idx} className="glass-dense p-4 rounded-panel border border-slate-200/60 dark:border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">{tmpl.title}</h4>
                <span className="text-[10px] font-mono text-slate-400">Template</span>
              </div>
              <div className="text-[10px] text-accent font-mono">{tmpl.category}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-100/50 dark:bg-slate-900/50 p-2.5 rounded-control leading-relaxed">
                "{tmpl.body}"
              </p>
              <button
                onClick={() => {
                  setMessageBody(tmpl.body.replace(' Reply STOP to cancel.', '').replace(' Reply STOP to opt out.', ''));
                  setActiveTab('composer');
                }}
                className="text-[11px] text-accent hover:underline font-medium pt-1"
              >
                Use this template
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Live SMS Threads */}
      {activeTab === 'conversations' && (
        <div className="glass-dense p-5 rounded-panel space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              Message History
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Twilio Webhook Ingest Active</span>
          </div>

          <div className="space-y-3">
            {smsRecords.map((s) => (
              <div key={s.id} className="p-3.5 rounded-control border border-slate-200/60 dark:border-slate-800/60 flex items-start justify-between text-xs font-mono">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{s.leadName}</span>
                    <span className="text-[10px] text-slate-500">{s.phone}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase ${s.direction === 'outbound' ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                      {s.direction}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mt-1">"{s.message}"</p>
                </div>
                <div className="text-right text-[10px] text-slate-400">
                  <div>{s.timestamp}</div>
                  <div className="text-emerald-600 capitalize mt-0.5">{s.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Consent Audit Log */}
      {activeTab === 'consent' && (
        <div className="glass-panel p-6 space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            TCPA & 10DLC Explicit Consent Audit Trail
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All outbound text messages require verified opt-in timestamps captured via web forms, physical intake forms, or double opt-in keywords.
          </p>

          <div className="p-3 rounded-control bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-xs font-mono space-y-1">
            <div className="text-slate-700 dark:text-slate-300 font-semibold">Consent Hash: sha256_e819b02a991c</div>
            <div className="text-slate-500 text-[11px]">Source: Web Form Checkbox "I consent to receive SMS" with IP 198.51.100.44</div>
          </div>
        </div>
      )}

      {/* Tab 5: Opt-Out List */}
      {activeTab === 'optouts' && (
        <div className="glass-panel p-6 space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Suppressed Phone Numbers (STOP Keyword)
          </h3>
          <div className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
            {suppressionList.map((sup) => (
              <div key={sup.id} className="py-2.5 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{sup.value}</span>
                  <div className="text-[10px] text-slate-500">{sup.source}</div>
                </div>
                <span className="text-[10px] text-slate-400">{sup.addedAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
