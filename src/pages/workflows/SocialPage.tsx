import React, { useState } from 'react';
import {
  Share2,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const LinkedinIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const FacebookIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { SocialPost } from '../../types';

export const SocialPage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const socialPosts = useDemoStore((state) => state.socialPosts).filter((p) => p.workspace_id === currentWorkspaceId);
  const addSocialPost = useDemoStore((state) => state.addSocialPost);

  const [activePlatform, setActivePlatform] = useState<'all' | 'instagram' | 'facebook' | 'linkedin'>('all');
  const [composerPlatform, setComposerPlatform] = useState<'instagram' | 'facebook' | 'linkedin'>('linkedin');
  const [caption, setCaption] = useState(
    'How top medical aesthetic clinics in the Northeast optimize treatment room margin and device downtime: 3 key takeaways from our Q1 operational benchmark report.'
  );

  const filteredPosts = socialPosts.filter((p) => {
    if (activePlatform === 'all') return true;
    return p.platform === activePlatform;
  });

  const handleCreatePost = async () => {
    addSocialPost({
      id: `post_${Date.now()}`,
      workspace_id: currentWorkspaceId,
      platform: composerPlatform,
      caption,
      scheduledDate: '2026-04-03',
      scheduledTime: '11:00 EST',
      status: 'scheduled',
      metrics: { impressions: 0, clicks: 0, engagementRate: '0%' },
    });
    setCaption('');
  };

  const getPlatformIcon = (platform: SocialPost['platform']) => {
    switch (platform) {
      case 'instagram':
        return <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />;
      case 'facebook':
        return <FacebookIcon className="w-3.5 h-3.5 text-blue-600" />;
      case 'linkedin':
      default:
        return <LinkedinIcon className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">03 WORKFLOWS</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Social</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold border border-amber-500/30">
              Conditional
            </span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Multi-Platform Social Calendar & AI Drafter
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Scheduled posts across Instagram, Facebook, and LinkedIn with compliance and connection gating.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="social_posts" count={socialPosts.length} />
          <DiagramChip reference="03 Workflows / Social (Conditional)" type="built" />
        </div>
      </div>

      {/* Connection Status Per Platform Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LinkedinIcon className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">LinkedIn Company Page</div>
              <div className="text-[10px] text-slate-500 font-mono">Drafts & Scheduled API</div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            Connected (Drafts only)
          </span>
        </div>

        <div className="glass-panel p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FacebookIcon className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Facebook Business Page</div>
              <div className="text-[10px] text-slate-500 font-mono">Meta Graph API</div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
            Pending App Review
          </span>
        </div>

        <div className="glass-panel p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <InstagramIcon className="w-4 h-4 text-pink-500" />
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Instagram Professional</div>
              <div className="text-[10px] text-slate-500 font-mono">Meta Graph API</div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
            Pending App Review
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Draft Composer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-dense p-5 rounded-panel space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              AI Social Post Drafter
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Destination Platform
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['linkedin', 'instagram', 'facebook'] as const).map((plat) => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setComposerPlatform(plat)}
                      className={`p-2 rounded-control border text-xs capitalize flex items-center justify-center gap-1.5 transition-colors ${
                        composerPlatform === plat
                          ? 'bg-blue-500/15 border-accent text-accent font-medium'
                          : 'border-slate-300/40 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {getPlatformIcon(plat)}
                      <span>{plat}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Post Caption & Call-to-Action
                </label>
                <textarea
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full p-3 text-xs font-mono rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-accent leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <ActionButton
                  rbacAction="create_plan"
                  variant="primary"
                  onAsyncClick={handleCreatePost}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Queue for Operator Approval</span>
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Month Schedule & Performance Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
                  Scheduled Posts Calendar ({filteredPosts.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">March - April 2026</span>
            </div>

            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <div key={post.id} className="p-4 rounded-control border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(post.platform)}
                      <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize font-mono">
                        {post.platform}
                      </span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-mono capitalize ${post.status === 'scheduled' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                        {post.status.replace('_', ' ')}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400">
                      {post.scheduledDate} {post.scheduledTime}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 font-mono text-[11px] leading-relaxed">
                    "{post.caption}"
                  </p>

                  {post.metrics && (
                    <div className="flex items-center gap-4 pt-1 border-t border-slate-200/40 dark:border-slate-800/40 text-[10px] font-mono text-slate-500">
                      <span>Impressions: {post.metrics.impressions}</span>
                      <span>Clicks: {post.metrics.clicks}</span>
                      <span>Engagement: {post.metrics.engagementRate}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
