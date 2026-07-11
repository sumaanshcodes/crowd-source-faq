import React, { useState } from 'react';
import api, { friendlyError } from '../../utils/api';

interface ReviewVoteButtonsProps {
  faqId: string;
  reviewCycle: number;
  initialAccurate?: number;
  initialNeedsUpdate?: number;
  onVoteUpdate?: (accurate: number, needsUpdate: number) => void;
}

export default function ReviewVoteButtons({
  faqId,
  reviewCycle,
  initialAccurate = 0,
  initialNeedsUpdate = 0,
  onVoteUpdate,
}: ReviewVoteButtonsProps) {
  const [accurate, setAccurate] = useState(initialAccurate);
  const [needsUpdate, setNeedsUpdate] = useState(initialNeedsUpdate);
  const [myVote, setMyVote] = useState<'still_accurate' | 'needs_update' | null>(null);
  const [suggestion, setSuggestion] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [loading, setLoading] = useState(false);

  const castVote = async (verdict: 'still_accurate' | 'needs_update', sugg?: string) => {
    setLoading(true);
    try {
      const res = await api.post<{
        accurateVotes: number;
        needsUpdateVotes: number;
        currentVote: string | null;
      }>(`/faq/${faqId}/vote-review`, {
        verdict,
        suggestion: sugg?.trim() || undefined,
      });
      const { accurateVotes, needsUpdateVotes } = res.data;
      setAccurate(accurateVotes);
      setNeedsUpdate(needsUpdateVotes);
      onVoteUpdate?.(accurateVotes, needsUpdateVotes);
    } catch (e) {
      console.error(friendlyError(e, 'Vote failed.'));
    } finally {
      setLoading(false);
    }
  };

  const handleAccurate = () => {
    if (myVote === 'still_accurate') {
      castVote('still_accurate');
      setMyVote(null);
    } else {
      if (myVote === 'needs_update') {
        setSuggestion('');
        setShowSuggestion(false);
      }
      castVote('still_accurate');
      setMyVote('still_accurate');
    }
  };

  const handleNeedsUpdate = () => {
    if (myVote === 'needs_update') {
      castVote('needs_update');
      setMyVote(null);
    } else {
      setShowSuggestion(true);
      setMyVote('needs_update');
    }
  };

  const handleSubmitNeedsUpdate = () => {
    castVote('needs_update', suggestion);
    setShowSuggestion(false);
  };

  return (
    <div className="space-y-3 mt-4 border-t border-gray-800/80 pt-4 font-sans">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Review this FAQ</p>
      <div className="flex gap-3">
        <button
          onClick={handleAccurate}
          disabled={loading}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all
            ${myVote === 'still_accurate'
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
              : 'border-gray-800 bg-[#131821] text-gray-400 hover:border-gray-600 hover:text-gray-300'
            }`}
        >
          <span>👍</span>
          <span>Still Accurate</span>
          {accurate > 0 && <span className="ml-auto opacity-60">({accurate})</span>}
        </button>

        <button
          onClick={handleNeedsUpdate}
          disabled={loading}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all
            ${myVote === 'needs_update'
              ? 'border-red-500/50 bg-red-500/10 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
              : 'border-gray-800 bg-[#131821] text-gray-400 hover:border-gray-600 hover:text-gray-300'
            }`}
        >
          <span>🔄</span>
          <span>Needs Update</span>
          {needsUpdate > 0 && <span className="ml-auto opacity-60">({needsUpdate})</span>}
        </button>
      </div>

      {showSuggestion && (
        <div className="space-y-2 mt-2 p-3 bg-gray-900/30 rounded-xl border border-gray-800/50">
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value.slice(0, 300))}
            placeholder="What's wrong with this answer? (optional)"
            rows={2}
            className="w-full rounded-lg border border-gray-700 bg-[#131821] px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-500/50 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => { setShowSuggestion(false); setMyVote(null); }}
              className="flex-1 py-2 text-xs font-medium rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitNeedsUpdate}
              disabled={loading}
              className="flex-1 py-2 text-xs font-bold rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}