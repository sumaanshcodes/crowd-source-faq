import React from 'react';
import { FAQItem, getQuestionTitle, getAnswerText } from './faqUtils';

// We added the missing props here and made them optional (?) 
// so it works perfectly on both the FAQ page and the Home page!
interface QuestionListProps {
  items: FAQItem[];
  loading?: boolean;
  sortOption?: string;
  onSortChange?: (val: string) => void;
  visibleCount?: number;
  onLoadMore?: () => void;
  emptyMessage?: string;
}

export default function QuestionList({ 
  items, 
  loading, 
  emptyMessage = "No questions found." 
}: QuestionListProps) {
  
  if (loading) {
    return (
      <div className="p-8 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-gray-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-16 text-gray-500 text-sm font-medium">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-800/80 flex-1 font-sans">
      {/* ... KEEP THE REST OF YOUR QUESTIONLIST CODE THE EXACT SAME ... */}
         // ...
      {items.map((q) => {
        const votes = typeof q.votes === 'number' ? q.votes : null;
        const views = typeof q.views === 'string' || typeof q.views === 'number' ? q.views : null;
        const author = typeof q.author === 'string' ? q.author : null;
        const time = typeof q.time === 'string' ? q.time : null;

        return (
          <div key={q._id} className="p-6 flex gap-6 hover:bg-gray-800/30 transition-colors group cursor-pointer items-start">

            {/* Upvote Block */}
            <div className="flex flex-col items-center w-12 shrink-0 pt-1">
              <div className="w-12 h-14 rounded-xl bg-[#0B0F15] border border-gray-800 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 flex flex-col items-center justify-center transition-colors shadow-sm">
                <svg className="text-emerald-500 mb-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"></polyline></svg>
                <span className="text-xs font-bold text-emerald-400">{votes ?? 0}</span>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-200 group-hover:text-emerald-400 transition-colors leading-snug truncate">
                {getQuestionTitle(q)}
              </h3>
              <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                {getAnswerText(q)}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-500">
                {q.category && (
                  <span className="bg-gray-800 text-gray-300 px-2.5 py-1 rounded-md border border-gray-700 font-bold">
                    {q.category}
                  </span>
                )}
                {author && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-700"></span> Asked by {author}
                  </span>
                )}
                {time && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-700"></span> {time}
                  </span>
                )}
              </div>
            </div>

            {/* Metrics on the Right */}
            <div className="flex items-center gap-5 text-gray-500 text-xs shrink-0 h-full pt-1">
              <div className="flex items-center gap-1.5 font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                {views ?? 0}
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                1
              </div>
              <div className="cursor-pointer hover:text-emerald-400 transition-colors ml-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}