import React, { useState, useMemo } from 'react';
import { faqData, FAQItem } from '@/components/faq/FaqData'; // Adjust this path if needed
import { getCategoryIcon } from '@/components/faq/faqUtils'; // Adjust this path if needed
import QuestionList from '@/components/faq/QuestionList'; // Adjust this path if needed

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [activeTab, setActiveTab] = useState('Most Popular');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically extract categories and counts
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    faqData.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, []);

  // Filter questions - EXPLICITLY TYPED AS FAQItem[] to fix your error
  const displayQuestions = useMemo<FAQItem[]>(() => {
    let filtered = faqData;
    if (activeCategory !== 'All Categories') {
      filtered = filtered.filter(q => q.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        q => q.question.toLowerCase().includes(query) || q.answer.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0B0F15] text-white p-6 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center pt-28 pb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-4 uppercase tracking-wider">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
            FAQs
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Frequently Asked <span className="text-emerald-500">Questions</span>
          </h1>
          
          {/* Main Search Bar */}
          <div className="relative mt-8 w-full max-w-2xl">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Ask anything about your internship..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131821] border border-gray-800 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-lg"
            />
          </div>
        </div>

        {/* Category Grid (Fixed clipping issue) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
          <button
            onClick={() => setActiveCategory('All Categories')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
              activeCategory === 'All Categories'
                ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                : 'border-gray-800 bg-[#131821] hover:border-gray-600 hover:bg-gray-800/40'
            }`}
          >
            <span className="text-2xl mb-2">㗊</span>
            <span className={`text-xs font-bold text-center leading-tight ${activeCategory === 'All Categories' ? 'text-emerald-400' : 'text-gray-300'}`}>All Categories</span>
            <span className="text-[10px] text-gray-500 mt-1 font-medium">{faqData.length} Questions</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                activeCategory === cat.name
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'border-gray-800 bg-[#131821] hover:border-gray-600 hover:bg-gray-800/40'
              }`}
            >
              <span className={`text-2xl mb-2 ${activeCategory === cat.name ? 'text-emerald-400' : 'text-gray-500'}`}>
                {getCategoryIcon(cat.name)}
              </span>
              <span className={`text-xs font-bold text-center leading-tight ${activeCategory === cat.name ? 'text-emerald-400' : 'text-gray-300'}`}>{cat.name}</span>
              <span className="text-[10px] text-gray-500 mt-1 font-medium">{cat.count} Questions</span>
            </button>
          ))}
        </div>

        {/* 3. Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Main Feed */}
          <div className="lg:col-span-2 bg-[#131821] border border-gray-800 rounded-xl overflow-hidden flex flex-col shadow-xl">
            
            {/* Feed Tabs */}
            <div className="flex items-center gap-6 px-6 border-b border-gray-800 bg-[#0B0F15]/50">
              {['Most Popular', 'Latest Questions', 'Unanswered'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 py-4 text-sm font-bold transition-colors border-b-2 ${
                    activeTab === tab
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab === 'Most Popular' && <span>🔥</span>}
                  {tab === 'Latest Questions' && <span>⏱️</span>}
                  {tab === 'Unanswered' && <span>❔</span>}
                  {tab}
                </button>
              ))}
            </div>

            {/* Questions List (Error resolved!) */}
            <QuestionList items={displayQuestions} />
            
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-[#131821] border border-gray-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white text-lg">Trending Questions</h3>
                <svg className="text-emerald-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              </div>
              <div className="space-y-5">
                <TrendingItem num={1} title="How to submit my Phase 1 (CSFAQ) project?" views="2.1k" />
                <TrendingItem num={2} title="What are Spurti Points (SP)?" views="1.8k" />
                <TrendingItem num={3} title="How do I get the link for daily Zoom standups?" views="1.4k" />
                <TrendingItem num={4} title="Why are videos stuck or repeating on ViBe?" views="980" />
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 flex items-center justify-between cursor-pointer hover:bg-emerald-500/10 transition-colors group shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div>
                  <h4 className="text-emerald-400 font-bold text-sm">Still have a doubt?</h4>
                  <p className="text-gray-400 text-xs mt-1 font-medium">Ask Yaksha in the chat</p>
                </div>
              </div>
              <svg className="text-emerald-500 transform group-hover:translate-x-1 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Sidebar Trending Item Component
const TrendingItem = ({ num, title, views }: { num: number, title: string, views: string }) => (
  <div className="flex gap-4 group cursor-pointer items-start">
    <div className="w-7 h-7 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center text-xs font-bold flex-shrink-0 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
      {num}
    </div>
    <div>
      <h4 className="text-sm font-bold text-gray-300 group-hover:text-emerald-400 transition-colors leading-snug">
        {title}
      </h4>
      <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5 font-medium">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> {views} views
      </p>
    </div>
  </div>
);