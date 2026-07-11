import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

interface SearchFeedbackProps {
  searchQuery: string;
  resultFaqId?: string;
}

export default function SearchFeedback({ searchQuery, resultFaqId }: SearchFeedbackProps) {
  const [dismissed, setDismissed] = useState(false);
  const [phase, setPhase] = useState<'prompt' | 'form' | 'done'>('prompt');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDismissed(false);
      setPhase('prompt');
    }, 8000);
    return () => clearTimeout(timer);
  }, [searchQuery, resultFaqId]);

  useEffect(() => {
    setDismissed(false);
    setPhase('prompt');
    setFeedback('');
    setError('');
  }, [searchQuery]);

  const handleYes = () => {
    setDismissed(true);
    setPhase('done');
  };

  const handleNo = () => {
    setPhase('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setLoading(true);
    setError('');
    try {
      await api.post('/search/unresolved', {
        query: searchQuery,
        faqId: resultFaqId || undefined,
        feedback: feedback.trim(),
      });
      setPhase('done');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (dismissed || phase === 'done') return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 font-sans animate-fade-in-up">
      <div className="bg-[#131821] rounded-2xl border border-gray-800 shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-5 backdrop-blur-md">
        {phase === 'prompt' ? (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="flex-1 text-sm font-medium text-white text-center sm:text-left">Did this answer your question?</p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleYes}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500 hover:text-black transition-colors"
              >
                <span>👍</span> Yes, I'm good
              </button>
              <button
                onClick={handleNo}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 bg-[#0B0F15] text-xs font-bold text-gray-300 hover:border-red-500/50 hover:text-red-400 transition-colors"
              >
                No, need help
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-white">What specifically didn't work?</p>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              placeholder="e.g. This FAQ didn't mention deadlines for submissions..."
              className="w-full rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="flex-1 py-2.5 rounded-xl border border-gray-700 text-xs font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={feedback.trim().length < 10 || loading}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}