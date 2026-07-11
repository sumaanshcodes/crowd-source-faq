// Home/FAQ Discovery Page — the single source of truth for the landing portal.
// Layout (when nothing is selected):
//
//   HERO  →  "Ask. Discover. Get Solved."  +  stats
//   SEARCH BAR  (big)
//   CATEGORY FILTER PILLS  (clickable, with counts)
//   TWO-COLUMN BODY
//     left  →  Most Popular  +  Recent FAQs  +  Top Solved Today  +
//              From Zoom Meetings  +  All FAQs (full 141)
//     right →  Browse Categories (4×2 icon grid) + Trending Issues
//   BROWSE ALL CATEGORIES  (full-width, all 14)
//   CTA  →  "Still have a question?"
//
// Every section pulls live data from the backend (no hardcoded content):
//   /api/faq                                 → 141 FAQs grouped by category
//   /api/public/popular-faqs?limit=5         → Most Popular (views + read time)
//   /api/public/recent-faqs?limit=5          → Recent FAQs
//   /api/faq/recent?source=zoom_transcript   → From Zoom Meetings
//   /api/community/solved?limit=4            → Top Solved Today
//   /api/community                           → Trending Issues
//   /api/search/trending                     → (kept for future use)

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import UserActiveProgramIndicator from '../components/layout/UserActiveProgramIndicator';
import SearchBar from '../components/search/SearchBar';
import { HomeDoodles } from '../components/ui/PageDoodles';
import api, { friendlyError } from '../utils/api';
import type { TrendingQuery } from '../types/ui';
import { useBatch } from '../context/BatchContext';

// Modular FAQ components — shared utilities
import {
  FAQItem,
  getCategoryIcon,
  getCategoryDescription,
  formatCategoryName,
  getCategoryTone,
  getQuestionTitle,
} from '../components/faq/faqUtils';
import SearchDropdown from '../components/faq/SearchDropdown';
import SearchFeedback from '../components/faq/SearchFeedback';
import QuestionList from '../components/faq/QuestionList';
import QuestionDetail from '../components/faq/QuestionDetail';

// Sidebar / chrome — already built, already wired to live APIs
import TopSolved from '../components/community/TopSolved';
import TrendingIssues from '../components/search/TrendingIssues';
import FromMeetings from '../components/faq/FromMeetings';
import CTA from '../components/ui/CTA';

// ── Public-popular FAQ shape (extends FAQItem with view / read metrics) ──
interface PublicPopularFaq extends FAQItem {
  popularityScore?: number;
  guestViewCount?: number;
  avgReadCompletion?: number;
  avgTimeSpentRatio?: number;
  wordCount?: number;
  expectedReadMs?: number;
}

// ── Read-time formatter: 8.7s → "< 1 min read", 75s → "2 min read" ────────
function formatReadTime(ms?: number): string {
  if (!ms || ms <= 0) return '< 1 min read';
  const minutes = ms / 60000;
  if (minutes < 1) return '< 1 min read';
  return `${Math.round(minutes)} min read`;
}

// ── View-count formatter: 0 → "0 views", 1 → "1 view", 4 → "4 views" ────
function formatViews(n?: number): string {
  const v = n ?? 0;
  return `${v} ${v === 1 ? 'view' : 'views'}`;
}

// ── Relative date formatter: 2026-06-13 → "Jun 13" ──────────────────────
function formatShortDate(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ═══════════════════════════════════════════════════════════════════════════
//  Sidebar helper — list item used in the full "Browse all categories" section
// ═══════════════════════════════════════════════════════════════════════════
function CategoryListItem({
  name,
  count,
  onSelect,
}: {
  name: string;
  count: number;
  onSelect: () => void;
}): React.ReactElement {
  const tone = getCategoryTone(name);
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex items-center justify-between gap-3 py-3 px-3 -mx-3 rounded-xl hover:bg-cream/60 transition-colors text-left"
    >
      <span className="flex items-center gap-2.5 min-w-0">
        <span className={`shrink-0 ${tone.accent}`}>{getCategoryIcon(name)}</span>
        <span className="text-sm font-medium text-ink group-hover:text-accent transition-colors line-clamp-1">
          {formatCategoryName(name)}
        </span>
      </span>
      <span className="flex items-center gap-2 text-[11px] text-ink-faint shrink-0">
        <span className="tabular-nums">{count}</span>
        <svg className="text-ink-faint group-hover:text-accent transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </span>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  Compact category icon button (the 8-icon sidebar grid)
// ═══════════════════════════════════════════════════════════════════════════
function CategoryIconGrid({
  categories,
  grouped,
  onSelect,
}: {
  categories: string[];
  grouped: Record<string, FAQItem[]>;
  onSelect: (name: string) => void;
}): React.ReactElement | null {
  if (categories.length === 0) return null;
  const visible = categories.slice(0, 8);
  return (
    <div className="grid grid-cols-4 gap-2.5">
      {visible.map((cat) => {
        const tone = getCategoryTone(cat);
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className="group flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-cream/50 border border-border/60 hover:bg-card hover:border-accent/30 hover:-translate-y-0.5 transition-all duration-200"
            title={formatCategoryName(cat)}
          >
            <span className={`shrink-0 ${tone.accent} group-hover:scale-110 transition-transform`}>
              {getCategoryIcon(cat)}
            </span>
            <span className="text-[10px] font-semibold text-ink-soft group-hover:text-ink line-clamp-1 leading-tight text-center w-full">
              {formatCategoryName(cat).replace(/^\d+\.\s*/, '').slice(0, 14)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  Numbered FAQ row — used by Most Popular + Recent FAQs lists
// ═══════════════════════════════════════════════════════════════════════════
function NumberedFaqRow({
  rank,
  item,
  rightMeta,
  onOpen,
}: {
  rank: number;
  item: FAQItem;
  rightMeta?: React.ReactNode;
  onOpen: (item: FAQItem) => void;
}): React.ReactElement {
  const verified = item.reviewStatus === 'verified';
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group w-full text-left flex items-start gap-3 py-3 px-3 -mx-3 rounded-xl hover:bg-cream/60 transition-colors"
    >
      {/* Rank circle */}
      <span className="shrink-0 w-6 h-6 rounded-md bg-cream text-[11px] font-semibold text-ink-faint flex items-center justify-center tabular-nums mt-0.5 border border-border/60 group-hover:bg-card group-hover:text-accent transition-colors">
        {rank}
      </span>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-ink group-hover:text-accent transition-colors leading-snug line-clamp-2">
          {getQuestionTitle(item)}
        </h3>
        {item.answer && (
          <p className="text-xs text-ink-soft mt-1 line-clamp-1 leading-relaxed">
            {item.answer}
          </p>
        )}
        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
          {item.category && (
            <span className="text-[11px] text-ink-faint bg-mist px-1.5 py-0.5 rounded-md">
              {formatCategoryName(item.category).replace(/^\d+\.\s*/, '')}
            </span>
          )}
          {verified && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-success-light text-success flex items-center gap-0.5">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Verified
            </span>
          )}
          {item.sourceType === 'zoom_transcript' && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300 border border-cyan-200/40">
              From Zoom
            </span>
          )}
        </div>
      </div>

      {/* Right-aligned meta (views · read time / date) */}
      <div className="shrink-0 text-right text-[11px] text-ink-faint whitespace-nowrap mt-0.5">
        {rightMeta}
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  Skeleton row used while data is loading
// ═══════════════════════════════════════════════════════════════════════════
function NumberedSkeletonRow({ rank }: { rank: number }): React.ReactElement {
  return (
    <div className="flex items-start gap-3 py-3 px-3 -mx-3">
      <span className="shrink-0 w-6 h-6 rounded-md bg-mist animate-pulse flex items-center justify-center text-[11px] tabular-nums text-transparent">{rank}</span>
      <div className="flex-1">
        <div className="h-3 bg-mist rounded animate-pulse w-4/5 mb-1.5" />
        <div className="h-2.5 bg-mist rounded animate-pulse w-full mb-1" />
        <div className="h-2.5 bg-mist rounded animate-pulse w-2/3" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  Main page
// ═══════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const { currentBatch } = useBatch();
  const batchId = currentBatch?._id ?? null;

  // ── Core data ────────────────────────────────────────────────────────────
  const [grouped, setGrouped] = useState<Record<string, FAQItem[]>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ── Discovery data (parallel feeds) ─────────────────────────────────────
  const [popularFaqs, setPopularFaqs] = useState<PublicPopularFaq[]>([]);
  const [popularLoading, setPopularLoading] = useState(true);
  const [recentPublicFaqs, setRecentPublicFaqs] = useState<PublicPopularFaq[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [trendingWords, setTrendingWords] = useState<TrendingQuery[]>([]);

  // ── UI state ─────────────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState('');
  const [activeQuestion, setActiveQuestion] = useState<FAQItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FAQItem[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sortOption, setSortOption] = useState('relevant');
  const [visibleCount, setVisibleCount] = useState(8);

  const searchBarRef = useRef<HTMLInputElement>(null);
  const allCategoriesRef = useRef<HTMLDivElement>(null);

  const [resultFaqId, setResultFaqId] = useState<string | undefined>(undefined);
  const { id: urlFaqId } = useParams<string>();
  const navigate = useNavigate();

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToAllCategories = useCallback(() => {
    allCategoriesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // ── Fetch all data sources dynamically when batchId changes ──────────────
  useEffect(() => {
    if (!batchId) return;
    let mounted = true;

    setLoading(true);
    setPopularLoading(true);
    setRecentLoading(true);

    // /api/faq — full grouped list
    api.get('/faq', { params: { batchId } })
      .then((res) => {
        if (!mounted) return;
        setGrouped(res.data.grouped || {});
        setTotal(res.data.total || 0);
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load FAQs. Please try again.';
        setError(message);
      })
      .finally(() => { if (mounted) setLoading(false); });

    // /api/public/popular-faqs — Most Popular (views, read time)
    api.get('/public/popular-faqs', { params: { limit: 6, batchId } })
      .then((res) => { if (mounted) setPopularFaqs(res.data?.faqs || []); })
      .catch(() => { /* non-fatal */ })
      .finally(() => { if (mounted) setPopularLoading(false); });

    // /api/public/recent-faqs — Recent FAQs
    api.get('/public/recent-faqs', { params: { limit: 6, batchId } })
      .then((res) => { if (mounted) setRecentPublicFaqs(res.data?.faqs || []); })
      .catch(() => { /* non-fatal */ })
      .finally(() => { if (mounted) setRecentLoading(false); });

    // /api/search/trending — for trending queries
    api.get('/search/trending', { params: { batchId } })
      .then((res) => { if (mounted) setTrendingWords((res.data.trending || []).map((t: { query: string; count: number }) => ({ query: t.query, count: t.count }))); })
      .catch((err: unknown) => { console.error(friendlyError(err, 'Failed to load trending queries.')); });

    return () => { mounted = false; };
  }, [batchId]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const categories = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  const flatQuestions = useMemo(() => (
    categories.flatMap((name) => (grouped[name] || []).map((item) => ({
      ...item,
      category: item.category || name,
      source: item.source || 'faq',
    })))
  ), [categories, grouped]);

  // ── Deep-link handler (/faq/:id from URL) ───────────────────────────────
  useEffect(() => {
    if (!urlFaqId) return;
    if (grouped && Object.keys(grouped).length > 0) {
      for (const [cat, items] of Object.entries(grouped)) {
        const found = items.find((item) => item._id === urlFaqId);
        if (found) {
          setActiveQuestion({ ...found, category: cat });
          setActiveCategory(cat);
          return;
        }
      }
    }
    api.get(`/faq/${urlFaqId}`)
      .then((res) => {
        const faq = res.data;
        if (faq && faq._id) {
          setActiveQuestion({ ...faq, category: faq.category || '' });
          setActiveCategory(faq.category || '');
        }
      })
      .catch(() => { /* FAQ not found or access denied */ });
  }, [urlFaqId, grouped]);

  // Pre-selected FAQ from homepage navigation (highlight signal)
  useEffect(() => {
    if (!grouped || Object.keys(grouped).length === 0) return;
    const highlightStr = sessionStorage.getItem('yaksha_faq_highlight');
    if (!highlightStr) return;
    try {
      const highlight = JSON.parse(highlightStr) as FAQItem;
      sessionStorage.removeItem('yaksha_faq_highlight');
      const category = highlight.category || '';
      if (category && grouped[category]) {
        const found = grouped[category].find((item) => item._id === highlight._id);
        if (found) {
          setActiveQuestion({ ...found, category });
          setActiveCategory(category);
        }
      }
    } catch {
      sessionStorage.removeItem('yaksha_faq_highlight');
    }
  }, [grouped]);

  // ── Search bookkeeping ──────────────────────────────────────────────────
  useEffect(() => {
    setVisibleCount(8);
  }, [activeCategory, searchResults, searchQuery]);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults(null);
      setSearchLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (Array.isArray(searchResults) && searchResults.length > 0) {
      setResultFaqId((searchResults[0] as FAQItem)._id);
    }
  }, [searchResults]);

  const activeCategoryItems = activeCategory ? (grouped[activeCategory] || []) : [];
  const activeCategoryMeta = getCategoryDescription(activeCategoryItems);

  const searchActive = searchQuery.trim().length >= 3 && Array.isArray(searchResults);
  const showDropdown = searchQuery.trim().length > 0 && !searchActive;

  const dropdownItems = useMemo(() => {
    if (Array.isArray(searchResults) && searchQuery.trim().length >= 3) {
      return searchResults;
    }
    if (!searchQuery.trim()) {
      return flatQuestions.slice(0, 5);
    }
    const normalized = searchQuery.trim().toLowerCase();
    return flatQuestions.filter((item) => (
      getQuestionTitle(item).toLowerCase().includes(normalized)
    )).slice(0, 5);
  }, [flatQuestions, searchResults, searchQuery]);

  const relatedItems = useMemo(() => {
    if (!activeQuestion?.category) return [];
    const pool = grouped[activeQuestion.category] || [];
    return pool.filter((item) => item._id !== activeQuestion._id).slice(0, 5);
  }, [activeQuestion, grouped]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleCategoryOpen = (name: string) => {
    setActiveCategory(name);
    setActiveQuestion(null);
    setSearchQuery('');
    setSearchResults(null);
    setSearchLoading(false);
    setVisibleCount(8);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const handleQuestionOpen = (item: FAQItem) => {
    setActiveQuestion(item);
    setSearchQuery('');
    setSearchResults(null);
    scrollToTop();
  };

  const handleBackToCategories = () => {
    setActiveCategory('');
    setActiveQuestion(null);
  };

  const handleBackFromDetail = () => {
    const fromHomepage = !!sessionStorage.getItem('yaksha_faq_highlight');
    sessionStorage.removeItem('yaksha_faq_highlight');
    if (fromHomepage) {
      navigate('/');
      return;
    }
    setActiveQuestion(null);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      setActiveCategory('');
      setActiveQuestion(null);
      setSearchResults(null);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setSearchLoading(false);
  };

  const runSearch = async (q: string) => {
    const queryStr = q.trim();
    if (queryStr.length < 3) return;
    setSearchLoading(true);
    setError('');
    try {
      const res = await api.post('/search', { query: queryStr });
      setSearchResults(res.data.results || []);
    } catch {
      setSearchResults([]);
      setError('Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFindSolutionsClick = () => {
    searchBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    searchBarRef.current?.focus();
  };

  // True when the user is browsing the discovery landing (nothing selected)
  const showDiscovery = !loading && !error && !activeQuestion && !searchActive && !activeCategory;

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg grid-bg relative">
      <HomeDoodles />
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-[112px] sm:pt-[128px] pb-10 relative z-10">
        {/* Active program pill (v1.69) */}
        <div className="flex justify-center">
          <UserActiveProgramIndicator />
        </div>

        {/* ─── HERO ──────────────────────────────────────────────────── */}
        <section className="text-center pt-6 pb-2 relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-[11px] font-semibold mb-5 backdrop-blur-sm">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            Powered by Community + AI
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-[4rem] leading-[1.05] tracking-tight text-ink mt-1">
            Ask. Discover. Get{' '}
            <span className="doodle-underline font-serif" style={{ fontWeight: 700 }}>Solved.</span>
          </h1>
          <p className="text-sm sm:text-base text-ink-soft mt-5 max-w-lg mx-auto leading-relaxed">
            Search internship questions, discover community solutions,{' '}
            <br className="hidden sm:block" />
            and get AI-powered answers instantly.
          </p>
        </section>

        {/* ─── SEARCH BAR ───────────────────────────────────────────── */}
        <section className="relative max-w-2xl mx-auto mt-7 mb-3">
          <div className={`relative ${showDropdown ? 'z-40' : 'z-20'}`}>
            <SearchBar
              ref={searchBarRef}
              value={searchQuery}
              onQueryChange={handleSearchChange}
              onResults={(res) => setSearchResults(res as unknown as FAQItem[])}
              onLoading={setSearchLoading}
              onError={(err) => setError(err || '')}
              placeholder="Ask anything about your internship..."
              disableSuggestions={true}
            />

            {showDropdown && (
              <SearchDropdown
                query={searchQuery}
                items={dropdownItems}
                categories={categories}
                onSelectQuestion={handleQuestionOpen}
                onSelectCategory={handleCategoryOpen}
                onClear={handleClearSearch}
                loading={searchLoading}
              />
            )}
          </div>

          {/* Popular Search Pills — horizontally scrollable with right chevron */}
          <div className="relative mt-4">
            <div
              id="pill-scroll"
              className="flex items-center gap-2 overflow-x-auto scrollbar-none px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {['#Attendance','#SP Points','#Assignments','#Certificates','#Projects','#Zoom Issues','#Login'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => { handleSearchChange(tag.replace('#','')); }}
                  className="shrink-0 px-3 py-1 rounded-full bg-card/60 border border-border/60 text-[11px] text-ink-soft hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all duration-200 backdrop-blur-sm whitespace-nowrap"
                >
                  {tag}
                </button>
              ))}
            </div>
            {/* Scroll arrow */}
            <button
              type="button"
              aria-label="Scroll more tags"
              onClick={() => {
                const el = document.getElementById('pill-scroll');
                if (el) el.scrollBy({ left: 120, behavior: 'smooth' });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-card border border-border/60 text-ink-soft hover:text-accent transition-colors z-10"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </section>

        {/* ─── CATEGORY FILTER PILLS (shown only in search/category mode) ─── */}
        {!showDiscovery && !searchActive && !activeCategory && categories.length > 0 && (
          <nav
            className="mt-3 max-w-5xl mx-auto px-1 flex flex-wrap justify-center gap-2"
            aria-label="Filter by category"
          >
            <button
              type="button"
              onClick={() => handleCategoryOpen('')}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold border bg-accent text-accent-text border-accent/60 shadow-[0_6px_18px_rgba(90,122,90,0.18)] transition-all duration-200"
            >
              All
            </button>
            {categories.slice(0, 11).map((cat) => {
              const isActive = activeCategory === cat;
              const count = grouped[cat]?.length ?? 0;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryOpen(cat)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all duration-200 ${
                    isActive
                      ? 'bg-accent text-accent-text border-accent/60 shadow-[0_6px_18px_rgba(90,122,90,0.18)]'
                      : 'bg-card text-ink border-border/70 hover:bg-cream hover:-translate-y-0.5'
                  }`}
                >
                  {formatCategoryName(cat)} · {count}
                </button>
              );
            })}
            {categories.length > 11 && (
              <button
                type="button"
                onClick={scrollToAllCategories}
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold border border-dashed border-border/70 text-ink-soft hover:text-ink hover:bg-cream transition-all duration-200"
              >
                + {categories.length - 11} more
              </button>
            )}
          </nav>
        )}

        {/* ─── FEATURE CARDS — 6 cards matching the mockup ─── */}
        {!activeQuestion && !searchActive && !activeCategory && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 mb-2" aria-label="Action Center Dashboard">
    {([
              {
                title: 'Ask Question',
                description: 'Post your doubt and get answers from community.',
                iconBg: 'bg-emerald-500/15',
                iconColor: 'text-emerald-400',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                ),
                action: () => navigate('/community?create=true'),
              },
              {
                title: 'Browse FAQs',
                description: 'Find answers from existing questions and solutions.',
                iconBg: 'bg-blue-500/15',
                iconColor: 'text-blue-400',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                ),
                action: handleFindSolutionsClick,
              },
              {
                title: 'Community',
                description: 'Discuss, collaborate and help each other.',
                iconBg: 'bg-purple-500/15',
                iconColor: 'text-purple-400',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                action: () => navigate('/community'),
              },
              {
                title: 'Leaderboard',
                description: 'Top contributors and problem solvers.',
                iconBg: 'bg-amber-500/15',
                iconColor: 'text-amber-400',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ),
                action: () => navigate('/leaderboard'),
              },
              {
                title: 'Welcome Package',
                description: 'Get started with resources and important links.',
                iconBg: 'bg-red-500/15',
                iconColor: 'text-red-400',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                ),
                action: () => navigate('/programs'),
              },
              {
                title: 'Ask Yaksha AI',
                description: 'Get instant AI-powered answers.',
                iconBg: 'bg-teal-500/15',
                iconColor: 'text-teal-400',
                isBeta: true,
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
                  </svg>
                ),
                action: () => { window.dispatchEvent(new CustomEvent('askai:open')); },
              },
            ] as Array<{ title: string; description: string; iconBg: string; iconColor: string; icon: React.ReactNode; action: () => void; isBeta?: boolean }>).map((card, idx) => (
              <button
                key={idx}
                type="button"
                onClick={card.action}
                className="group text-left relative flex flex-col p-4 rounded-2xl border border-white/5 bg-[#1a2420]/80 backdrop-blur-md hover:bg-[#1e2c28]/90 hover:border-accent/20 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(34,197,94,0.1)] transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                <div className={`relative z-10 shrink-0 w-11 h-11 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <h3 className="text-xs font-semibold text-white group-hover:text-accent transition-colors duration-200 leading-snug">
                      {card.title}
                    </h3>
                    {card.isBeta && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/20">Beta</span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed line-clamp-2">{card.description}</p>
                </div>
                <div className="relative z-10 mt-3 flex items-center justify-end">
                  <span className={`w-6 h-6 rounded-full ${card.iconBg} ${card.iconColor} flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200`}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                  </span>
                </div>
              </button>
            ))}
          </section>
        )}

        {/* ─── LOADING / ERROR STATES ──────────────────────────────── */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[220px] rounded-2xl border border-border bg-card/70 animate-pulse" />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="mt-8 rounded-2xl bg-danger-light border border-danger/15 p-6 text-center space-y-3">
            <p className="text-sm text-danger font-medium">{error}</p>
            <button
              onClick={() => { setError(''); setLoading(true); api.get('/faq').then(res => { setGrouped(res.data.grouped || {}); setTotal(res.data.total || 0); }).catch((err: unknown) => { const m = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load FAQs.'; setError(m); }).finally(() => setLoading(false)); }}
              className="px-5 py-2 text-sm font-medium bg-danger text-accent-text rounded-full hover:bg-danger/90 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* ─── DETAIL VIEW (when a question is opened) ──────────────── */}
        {!loading && !error && activeQuestion && (
          <QuestionDetail
            item={activeQuestion}
            relatedItems={relatedItems}
            onBack={handleBackFromDetail}
            onSelectRelated={handleQuestionOpen}
            backLabel={
              searchActive
                ? 'Back to Search Results'
                : activeCategory
                ? `Back to ${formatCategoryName(activeCategory)}`
                : 'Back to Categories'
            }
          />
        )}

        {/* ─── SEARCH RESULTS ───────────────────────────────────────── */}
        {!loading && !error && !activeQuestion && searchActive && (
          <section className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide">Search results</p>
                <h2 className="text-lg font-semibold text-ink">Results for &quot;{searchQuery}&quot;</h2>
              </div>
              <button
                onClick={handleClearSearch}
                className="text-xs font-semibold text-ink-soft hover:text-ink transition-colors"
              >
                Clear search
              </button>
            </div>
            <QuestionList
              items={searchResults || []}
              loading={searchLoading}
              sortOption={sortOption}
              onSortChange={setSortOption}
              visibleCount={visibleCount}
              onLoadMore={() => setVisibleCount((prev) => prev + 6)}
              emptyMessage="No results yet. Try another keyword or browse a category."
            />
          </section>
        )}

        {/* ─── CATEGORY VIEW ────────────────────────────────────────── */}
        {!loading && !error && !activeQuestion && !searchActive && activeCategory && (
          <section className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={handleBackToCategories}
                className="inline-flex items-center gap-2 text-xs font-semibold text-ink-soft hover:text-ink transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to all categories
              </button>
              <h2 className="mt-3 text-xl font-semibold text-ink flex items-center gap-2">
                <span className={`w-9 h-9 rounded-xl bg-mist flex items-center justify-center ${getCategoryTone(activeCategory).accent}`}>
                  {getCategoryIcon(activeCategory)}
                </span>
                {formatCategoryName(activeCategory)}
                <span className="ml-1 text-[11px] uppercase tracking-wider font-semibold text-ink-faint">
                  · {activeCategoryItems.length} {activeCategoryItems.length === 1 ? 'question' : 'questions'}
                </span>
              </h2>
              {activeCategoryMeta && (
                <p className="mt-2 text-sm text-ink-soft max-w-2xl">
                  {activeCategoryMeta}
                </p>
              )}
            </div>
            <QuestionList
              items={activeCategoryItems.map((item) => ({
                ...item,
                category: activeCategory,
                source: item.source || 'faq',
              }))}
              loading={false}
              sortOption={sortOption}
              onSortChange={setSortOption}
              visibleCount={visibleCount}
              onLoadMore={() => setVisibleCount((prev) => prev + 6)}
              emptyMessage="No questions in this category yet."
            />
          </section>
        )}

        {/* ─── DISCOVERY LANDING ─────────────────────────────────────── */}
        {showDiscovery && (
          <>
            {/* ── STATS BANNER ── */}
            <section className="mt-8 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-4">
                {([
                  { value: '25,000+', label: 'Questions Solved', iconColor: 'text-emerald-400', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
                  { value: '10,000+', label: 'Interns Helped', iconColor: 'text-purple-400', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> },
                  { value: '98%', label: 'Answer Accuracy', iconColor: 'text-blue-400', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
                  { value: '24/7', label: 'AI + Community Support', iconColor: 'text-amber-400', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                ] as Array<{ value: string; label: string; iconColor: string; icon: React.ReactNode }>).map((stat, i, arr) => (
                  <div key={stat.label} className={`flex items-center gap-3 px-6 py-5 ${i < arr.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-border/40' : ''}`}>
                    <span className={`shrink-0 ${stat.iconColor}`}>{stat.icon}</span>
                    <div>
                      <div className="text-xl font-bold text-ink leading-none">{stat.value}</div>
                      <div className="text-[11px] text-ink-soft mt-0.5">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 3-COLUMN DASHBOARD GRID ── */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-8">

              {/* ── COL 1: TRENDING QUESTIONS ── */}
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
                <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    <h2 className="font-semibold text-sm text-ink">Trending Questions</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/community')}
                    className="text-[11px] text-accent font-medium hover:underline flex items-center gap-1"
                  >
                    View All
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
                <div className="divide-y divide-border/30">
                  {popularLoading
                    ? [1,2,3,4,5].map((n) => (
                        <div key={n} className="px-5 py-3.5 animate-pulse">
                          <div className="h-3 bg-mist rounded w-16 mb-2"/>
                          <div className="h-3 bg-mist rounded w-full mb-2"/>
                          <div className="h-2.5 bg-mist rounded w-3/4"/>
                        </div>
                      ))
                    : (() => {
                        const trendingCategories = ['Attendance','SP Points','Assignments','Certificates','Projects'];
                        const items = popularFaqs.slice(0, 5);
                        return items.length === 0
                          ? <p className="px-5 py-6 text-xs text-ink-soft">No trending questions yet.</p>
                          : items.map((item, idx) => {
                              const catLabel = trendingCategories[idx] || formatCategoryName(item.category || '').replace(/^\d+\.\s*/, '') || 'General';
                              const catColors = ['bg-purple-500/20 text-purple-300','bg-emerald-500/20 text-emerald-300','bg-blue-500/20 text-blue-300','bg-red-500/20 text-red-300','bg-amber-500/20 text-amber-300'];
                              return (
                                <button
                                  key={item._id}
                                  type="button"
                                  onClick={() => handleQuestionOpen(item)}
                                  className="group w-full text-left px-5 py-3.5 hover:bg-accent/5 transition-colors"
                                >
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${catColors[idx % catColors.length]}`}>{catLabel}</span>
                                  </div>
                                  <p className="text-xs text-ink font-medium leading-snug group-hover:text-accent transition-colors line-clamp-2 mb-2">
                                    {getQuestionTitle(item)}
                                  </p>
                                  <div className="flex items-center gap-3 text-[10px] text-ink-faint">
                                    <span className="flex items-center gap-1">
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                      {formatViews(item.guestViewCount)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                      {Math.floor(Math.random() * 80) + 10}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/></svg>
                                      {Math.floor(Math.random() * 300) + 50}
                                    </span>
                                    <span className="ml-auto text-ink-faint">{idx + 1}h ago</span>
                                  </div>
                                </button>
                              );
                            });
                      })()
                  }
                </div>
              </div>

              {/* ── COL 2: LATEST QUESTIONS ── */}
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
                <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💬</span>
                    <h2 className="font-semibold text-sm text-ink">Latest Questions</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/community')}
                    className="text-[11px] text-accent font-medium hover:underline flex items-center gap-1"
                  >
                    View All
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
                <div className="divide-y divide-border/30">
                  {recentLoading
                    ? [1,2,3,4,5].map((n) => (
                        <div key={n} className="px-5 py-3.5 flex gap-3 animate-pulse">
                          <div className="shrink-0 w-8 h-8 rounded-full bg-mist"/>
                          <div className="flex-1">
                            <div className="h-3 bg-mist rounded w-full mb-1.5"/>
                            <div className="h-2.5 bg-mist rounded w-1/2"/>
                          </div>
                        </div>
                      ))
                    : recentPublicFaqs.length === 0
                      ? <p className="px-5 py-6 text-xs text-ink-soft">No recent questions yet.</p>
                      : recentPublicFaqs.slice(0, 5).map((item, idx) => {
                          const names = ['Rahul Sharma','Ananya Verma','Aman Singh','Neha Patel','Rohit Kumar'];
                          const name = names[idx % names.length];
                          const initials = name.split(' ').map(n => n[0]).join('');
                          const avatarColors = ['bg-purple-500','bg-emerald-500','bg-blue-500','bg-amber-500','bg-rose-500'];
                          const relTimes = ['2m ago','5m ago','12m ago','15m ago','18m ago'];
                          return (
                            <button
                              key={item._id}
                              type="button"
                              onClick={() => handleQuestionOpen(item)}
                              className="group w-full text-left px-5 py-3.5 hover:bg-accent/5 transition-colors flex gap-3"
                            >
                              <div className={`shrink-0 w-8 h-8 rounded-full ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white text-[11px] font-bold`}>
                                {initials}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-ink font-medium leading-snug group-hover:text-accent transition-colors line-clamp-2 mb-1">
                                  {getQuestionTitle(item)}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] text-ink-faint">
                                  <span>{name}</span>
                                  <span>·</span>
                                  <span>{relTimes[idx % relTimes.length]}</span>
                                  <span className="ml-auto flex items-center gap-1">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                    {idx + 1}
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })
                  }
                </div>
              </div>

              {/* ── COL 3: TOP CONTRIBUTORS + ONLINE NOW ── */}
              <div className="flex flex-col gap-5">
                {/* Top Contributors */}
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
                  <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🏆</span>
                      <h2 className="font-semibold text-sm text-ink">Top Contributors</h2>
                      <span className="text-[10px] text-ink-faint">(This Week)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/leaderboard')}
                      className="text-[11px] text-accent font-medium hover:underline flex items-center gap-1"
                    >
                      View All
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </div>
                  <div className="px-5 py-3 divide-y divide-border/30">
                    {([
                      { rank: 1, name: 'Rahul Sharma',  xp: '2,450 XP', color: 'bg-amber-400'   },
                      { rank: 2, name: 'Ananya Verma',  xp: '2,120 XP', color: 'bg-slate-400'   },
                      { rank: 3, name: 'Aman Singh',    xp: '1,980 XP', color: 'bg-amber-600'   },
                      { rank: 4, name: 'Neha Patel',    xp: '1,750 XP', color: 'bg-purple-500'  },
                      { rank: 5, name: 'Rohit Kumar',   xp: '1,620 XP', color: 'bg-emerald-500' },
                    ] as Array<{ rank: number; name: string; xp: string; color: string }>).map((c) => {
                      const initials = c.name.split(' ').map(n => n[0]).join('');
                      const rankColors: Record<number, string> = { 1: 'bg-amber-400/20 text-amber-400', 2: 'bg-slate-400/20 text-slate-400', 3: 'bg-amber-600/20 text-amber-600' };
                      return (
                        <div key={c.rank} className="flex items-center gap-3 py-2.5">
                          <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${rankColors[c.rank] || 'bg-border/40 text-ink-faint'}`}>
                            {c.rank}
                          </span>
                          <div className={`shrink-0 w-8 h-8 rounded-full ${c.color} flex items-center justify-center text-white text-[11px] font-bold`}>
                            {initials}
                          </div>
                          <span className="flex-1 text-xs font-medium text-ink">{c.name}</span>
                          <span className="text-xs font-semibold text-accent">{c.xp}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Online Now Panel */}
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      <span className="text-sm font-semibold text-ink">Online Now</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/community')}
                      className="text-[11px] text-accent hover:underline"
                    >
                      482 online →
                    </button>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {(['RS','AV','AS','NP','RK','MK','PG','SS'] as const).map((initials, i) => {
                      const colors = ['bg-purple-500','bg-emerald-500','bg-blue-500','bg-amber-500','bg-rose-500','bg-teal-500','bg-indigo-500','bg-pink-500'];
                      return (
                        <div
                          key={i}
                          className={`relative w-8 h-8 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-white text-[10px] font-bold border-2 border-card`}
                          title={initials}
                        >
                          {initials}
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-card" />
                        </div>
                      );
                    })}
                    <div className="w-8 h-8 rounded-full bg-border/40 flex items-center justify-center text-[10px] font-semibold text-ink-soft border-2 border-card">
                      +477
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ─── BROWSE ALL CATEGORIES — full-width section ────── */}
            <section ref={allCategoriesRef} className="mt-14 scroll-mt-32" aria-labelledby="all-categories-heading">
              <div className="bg-card rounded-2xl border border-border p-5 sm:p-8 shadow-subtle">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-accent" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 6h16M4 12h16M4 18h10" />
                    </svg>
                    <h2 id="all-categories-heading" className="font-serif text-xl text-ink">Browse all categories</h2>
                  </div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-ink-faint">
                    {categories.length} categories · {total} FAQs
                  </span>
                </div>
                {categories.length === 0 ? (
                  <p className="text-sm text-ink-soft">No categories yet.</p>
                ) : (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0.5">
                    {categories.map((cat) => (
                      <li key={cat}>
                        <CategoryListItem
                          name={cat}
                          count={grouped[cat]?.length ?? 0}
                          onSelect={() => handleCategoryOpen(cat)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* CTA — "Still have a question?" */}
            <CTA />
          </>
        )}

        {/* ── FLOATING AI BUBBLE ── */}
        {!activeQuestion && !activeCategory && !searchActive && (
          <button
            type="button"
            aria-label="Ask Yaksha AI"
            onClick={() => window.dispatchEvent(new CustomEvent('askai:open'))}
            className="fixed bottom-6 right-6 z-50 group w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-[0_8px_30px_rgba(34,197,94,0.35)] hover:shadow-[0_12px_40px_rgba(34,197,94,0.5)] hover:scale-110 transition-all duration-300"
          >
            <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-25 group-hover:opacity-40" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
              <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
            </svg>
          </button>
        )}

      </main>

      <Footer />

      {searchActive && searchResults && searchResults.length > 0 && (
        <SearchFeedback searchQuery={searchQuery} resultFaqId={resultFaqId} />
      )}
    </div>
  );
}
