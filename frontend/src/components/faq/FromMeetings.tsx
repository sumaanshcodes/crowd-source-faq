import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import type { RecentFAQ, ZoomPublicStats } from '../../types/ui';
import { useBatch } from '../../context/BatchContext';

/**
 * "From Zoom Meetings" — surfaces the project's actual goal on the home page.
 *
 * Renders only when there is at least one Zoom-derived FAQ in the system.[cite: 13]
 * If no meetings have been processed yet, the whole section is hidden so
 * the home page still feels calm and useful.[cite: 13]
 */

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function VideoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function FromMeetings() {
  const { currentBatch } = useBatch();
  const batchId = currentBatch?._id ?? null;
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<RecentFAQ[]>([]);
  const [stats, setStats] = useState<ZoomPublicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!batchId) return;
    let isMounted = true;
    setLoading(true);
    Promise.all([
      api.get<{ faqs: RecentFAQ[] }>('/faq/recent', { params: { source: 'zoom_transcript', limit: 6, batchId } }),
      api.get<ZoomPublicStats>('/zoom/public-stats', { params: { batchId } }),
    ])
      .then(([faqsRes, statsRes]) => {
        if (!isMounted) return;
        setFaqs(faqsRes.data.faqs || []);
        setStats(statsRes.data);
      })
      .catch(() => {
        if (!isMounted) return;
        setFaqs([]);
        setStats(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [batchId]);

  const hasData = faqs.length > 0;
  const anyZoomActivity =
    !!stats && (stats.meetingsProcessed > 0 || stats.insightsExtracted > 0 || stats.knowledgeExtracted > 0);

  // Skeleton while loading
  if (loading) {
    return (
      <section className="mt-12 font-sans text-white">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 bg-gray-800 rounded animate-pulse" />
          <div className="h-5 w-56 bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[160px] rounded-xl border border-gray-800/50 bg-[#131821]/50 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12 font-sans text-white">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <VideoIcon />
            <p className="text-[11px] font-bold uppercase tracking-wider">From Zoom Meetings</p>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
            {hasData
              ? (<>Questions interns asked... <span className="text-emerald-500">and we solved in Zoom.</span></>)
              : 'Doubts answered in your team\'s Zoom sessions, turned into FAQs'}
          </h2>
          <p className="mt-2 text-sm text-gray-400 max-w-xl">
            {hasData
              ? 'Auto-extracted from intern sessions. We listen, transcribe, and turn answers into FAQs.'
              : 'Admins connect Zoom once. New meetings get transcribed, questions get extracted, and answers show up here for everyone to search.'}
          </p>
        </div>
        
        {anyZoomActivity && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-gray-400 bg-[#131821] border border-gray-800/80 rounded-lg px-3 py-1.5 shadow-sm">
              <span className="text-emerald-400 mr-1">{stats!.meetingsProcessed}</span> meetings
            </span>
            <span className="text-[11px] font-medium text-gray-400 bg-[#131821] border border-gray-800/80 rounded-lg px-3 py-1.5 shadow-sm">
              <span className="text-emerald-400 mr-1">{stats!.faqsPromoted}</span> FAQs added
            </span>
          </div>
        )}
      </div>

      {hasData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {faqs.map((faq) => (
            <article
              key={faq._id}
              onClick={() => navigate(`/faq/${faq._id}`)}
              className="group cursor-pointer rounded-xl border border-gray-800/80 bg-[#131821] hover:border-emerald-500/50 hover:bg-gray-800/20 transition-all duration-300 p-5 flex flex-col shadow-lg shadow-black/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  MEETING
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                  ZOOM
                </span>
              </div>
              <h3 className="text-base font-semibold text-gray-200 leading-snug line-clamp-2 group-hover:text-emerald-400 transition-colors">
                {faq.question}
              </h3>
              {faq.answer && (
                <p className="mt-2 text-xs text-gray-400 leading-relaxed line-clamp-3">
                  {faq.answer}
                </p>
              )}
              <div className="mt-auto pt-4 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-800/50">
                <span className="truncate pr-2">
                  {faq.sourceMeetingTopic ? `From: ${faq.sourceMeetingTopic}` : formatRelativeTime(faq.createdAt)}
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-gray-400 group-hover:text-emerald-400 transition-colors whitespace-nowrap">
                  Read <ArrowRightIcon />
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        // Empty state
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <HowItWorksStep
            n="1"
            title="Connect Zoom"
            body="An admin links the team's Zoom account once from the Account page."
          />
          <HowItWorksStep
            n="2"
            title="Meetings get transcribed"
            body="When a meeting ends, we pull the transcript and pick out the questions."
          />
          <HowItWorksStep
            n="3"
            title="Answers become FAQs"
            body="Confirmed Q&As are saved as FAQs that everyone can search and upvote."
          />
        </div>
      )}
    </section>
  );
}

function HowItWorksStep({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-gray-800/80 bg-[#131821] p-6 shadow-lg shadow-black/20 group hover:border-emerald-500/30 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold group-hover:bg-emerald-500/20 transition-colors">
          {n}
        </span>
        <h3 className="text-sm font-bold text-gray-200">{title}</h3>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed">{body}</p>
    </div>
  );
}