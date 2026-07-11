import React from 'react';
import { FAQItem, getCategoryIcon, formatCategoryName, getQuestionTitle, getAnswerText } from './faqUtils';

interface SearchDropdownProps {
  query: string;
  items: FAQItem[];
  categories: string[];
  onSelectQuestion: (item: FAQItem) => void;
  onSelectCategory: (name: string) => void;
  onClear: () => void;
  loading: boolean;
}

export default function SearchDropdown({
  query,
  items,
  categories,
  onSelectQuestion,
  onSelectCategory,
  onClear,
  loading,
}: SearchDropdownProps) {
  return (
    <div className="absolute left-0 right-0 top-full mt-3 z-50 animate-fade-in font-sans">
      <div className="bg-[#131821] border border-gray-800 rounded-xl shadow-2xl shadow-black/80 overflow-hidden backdrop-blur-md">
        
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-800/50">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Search suggestions
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Results for <span className="font-bold text-white">"{query}"</span>
            </p>
          </div>
          <button
            onClick={onClear}
            className="text-xs font-medium text-gray-500 hover:text-emerald-400 transition-colors"
          >
            Clear
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1.35fr_0.95fr] bg-[#0B0F15]/50">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Matching questions
              </p>
              <span className="text-xs font-medium text-emerald-500/70">{items.length} found</span>
            </div>
            
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
              {loading && (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-[72px] rounded-xl bg-gray-800/50 animate-pulse border border-gray-800/80" />
                ))
              )}
              {!loading && items.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-700 bg-transparent p-5 text-center">
                  <p className="text-xs text-gray-500">
                    No matches yet. Keep typing or browse a category.
                  </p>
                </div>
              )}
              {!loading && items.map((item, idx) => (
                <button
                  key={item._id || item.title || item.question || idx}
                  onClick={() => onSelectQuestion(item)}
                  className="w-full text-left rounded-xl border border-gray-800 bg-[#131821] px-4 py-3 hover:border-emerald-500/40 hover:bg-gray-800/40 transition-colors group"
                >
                  <p className="text-sm font-bold text-gray-200 group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {getQuestionTitle(item)}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-1.5">
                    {getAnswerText(item)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">
              Categories
            </p>
            <div className="space-y-2">
              {categories.slice(0, 7).map((name) => (
                <button
                  key={name}
                  onClick={() => onSelectCategory(name)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-800 bg-[#131821] text-left hover:border-emerald-500/40 hover:bg-gray-800/40 transition-colors group"
                >
                  <span className="text-gray-500 group-hover:text-emerald-400 transition-colors">
                    {getCategoryIcon(name)}
                  </span>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {formatCategoryName(name)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}