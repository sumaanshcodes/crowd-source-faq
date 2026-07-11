import React from 'react';
import { FAQItem, getQuestionTitle, getAnswerText, formatDate, getCategoryIcon, formatCategoryName, TrustBadge } from './faqUtils';
import ReportFAQButton from './ReportFAQButton';
import FreshnessBadge from './FreshnessBadge'; // Adjusted path if needed

interface QuestionDetailProps {
  item: FAQItem;
  relatedItems: FAQItem[];
  onBack: () => void;
  onSelectRelated: (item: FAQItem) => void;
  backLabel?: string;
}

export default function QuestionDetail({ item, relatedItems, onBack, onSelectRelated, backLabel }: QuestionDetailProps) {
  const title = getQuestionTitle(item);
  const prefix = item.questionNumber ? `${item.questionNumber}. ` : '';
  const answer = getAnswerText(item);
  const metaDate = formatDate(item?.updatedAt || item?.createdAt);
  const sourceLabel = item?.source ? (item.source === 'faq' ? 'System FAQ' : 'Community') : '';
  const trustLevel = item?.trustLevel;
  
  // Highlight extraction logic
  const highlight = answer ? answer.split('. ').slice(0, 1).join('. ') : '';

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6 text-white font-sans max-w-7xl mx-auto p-6">
      
      {/* Left Sidebar (Desktop Only) */}
      <aside className="hidden lg:flex flex-col gap-6">
        
        {/* Category Card */}
        <div className="rounded-xl border border-gray-800/80 bg-[#131821] p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Category</p>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <span className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              {getCategoryIcon(item?.category || '')}
            </span>
            <span className="font-medium">
              {item?.categoryNumber ? `${item.categoryNumber}. ` : ''}{formatCategoryName(item?.category || 'General')}
            </span>
          </div>
        </div>

        {/* Related Questions Sidebar */}
        <div className="rounded-xl border border-gray-800/80 bg-[#131821] p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Related questions</p>
          <div className="space-y-3">
            {relatedItems.length === 0 && (
              <p className="text-xs text-gray-500">No related questions yet.</p>
            )}
            {relatedItems.map((rel) => (
              <button
                key={rel._id}
                onClick={() => onSelectRelated(rel)}
                className="w-full text-left text-sm text-gray-400 hover:text-emerald-400 transition-colors line-clamp-2 leading-snug group"
              >
                <span className="text-gray-600 mr-1 group-hover:text-emerald-500/50 transition-colors">
                  {rel.questionNumber ? `${rel.questionNumber}. ` : ''}
                </span>
                {getQuestionTitle(rel)}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="bg-[#131821] rounded-xl border border-gray-800/80 shadow-2xl p-6 md:p-8">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-emerald-400 transition-colors mb-6 group"
        >
          <svg className="transform group-hover:-translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {backLabel || 'Back to FAQs'}
        </button>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {sourceLabel && (
            <span className="px-3 py-1 rounded-md bg-gray-800/50 border border-gray-700/50 text-xs font-medium text-gray-300">
              {sourceLabel}
            </span>
          )}
          {metaDate && (
            <span className="text-xs text-gray-500 flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Updated {metaDate}
            </span>
          )}
          {item?.source === 'faq' && (
            <FreshnessBadge
              reviewStatus={item.reviewStatus}
              lastVerifiedDate={item.lastVerifiedDate}
              reviewIntervalDays={item.reviewIntervalDays ?? 0}
              freshnessTier={item.freshnessTier}
            />
          )}
        </div>

        {/* Question Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-6 flex flex-wrap items-center gap-3">
          <span className="text-emerald-500 shrink-0">{prefix}</span>
          {title}
          {trustLevel && <TrustBadge level={trustLevel} />}
        </h1>

        {/* Key Takeaway Highlight */}
        {highlight && (
          <div className="mb-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Key takeaway
            </p>
            <p className="text-base text-gray-300 font-medium leading-relaxed">{highlight}.</p>
          </div>
        )}

        {/* Full Answer Body */}
        <div className="prose prose-invert prose-emerald max-w-none">
          {answer ? (
            <div className="text-base text-gray-400 leading-relaxed whitespace-pre-wrap">
              {answer}
            </div>
          ) : (
            <p className="text-base text-gray-500 italic">No answer available yet.</p>
          )}
        </div>

        {/* Mobile Related Questions (Hidden on Desktop) */}
        {relatedItems.length > 0 && (
          <div className="mt-10 lg:hidden border-t border-gray-800/80 pt-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Related questions</p>
            <div className="flex flex-col gap-2">
              {relatedItems.map((rel) => (
                <button
                  key={rel._id}
                  onClick={() => onSelectRelated(rel)}
                  className="w-full text-left p-3 rounded-lg border border-gray-800/50 bg-gray-900/30 text-sm text-gray-400 hover:border-emerald-500/30 hover:text-emerald-400 transition-colors"
                >
                  {rel.questionNumber ? `${rel.questionNumber}. ` : ''}{getQuestionTitle(rel)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons (Report etc.) */}
        <div className="mt-10 pt-6 border-t border-gray-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Thumbs up/down mockup */}
            <span className="text-xs text-gray-500 mr-2">Was this helpful?</span>
            <button className="w-8 h-8 rounded border border-gray-700 flex items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-colors">👍</button>
            <button className="w-8 h-8 rounded border border-gray-700 flex items-center justify-center text-gray-400 hover:border-red-500 hover:text-red-500 transition-colors">👎</button>
          </div>
          
          <ReportFAQButton item={item} />
        </div>
        
      </div>
    </div>
  );
}