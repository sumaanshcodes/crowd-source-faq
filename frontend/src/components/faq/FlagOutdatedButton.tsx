import React, { useState, useRef } from 'react';
import api from '../../utils/api';

interface FlagOutdatedButtonProps {
  faqId: string;
  reviewStatus: string;
  onFlagged?: () => void;
}

export default function FlagOutdatedButton({ faqId, reviewStatus, onFlagged }: FlagOutdatedButtonProps) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    setShowModal(true);
    setReason('');
    setError('');
    setTimeout(() => dialogRef.current?.showModal(), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.patch(`/faq/${faqId}/flag`, { reason: reason.trim() });
      dialogRef.current?.close();
      setShowModal(false);
      onFlagged?.();
    } catch (err: unknown) {
      const e2 = err as { response?: { data?: { message?: string } } };
      if (e2.response?.data?.message?.includes('already under review')) {
        setError('This FAQ is already under review.');
      } else {
        setError(e2.response?.data?.message || 'Failed to flag. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isAlreadyUnderReview = reviewStatus === 'pending_review' || reviewStatus === 'update_requested';

  return (
    <>
      <button
        onClick={openModal}
        disabled={isAlreadyUnderReview}
        title={isAlreadyUnderReview ? 'This FAQ is already under review' : 'Flag as outdated'}
        className={`text-xs px-3 py-1.5 rounded-md border transition-colors flex items-center gap-1.5
          ${isAlreadyUnderReview
            ? 'border-gray-800 text-gray-600 cursor-not-allowed bg-gray-900/30'
            : 'border-gray-700 text-gray-400 hover:border-orange-500/50 hover:text-orange-400 hover:bg-orange-500/10'
          }`}
      >
        🚩 {isAlreadyUnderReview ? 'Under review' : 'Flag outdated'}
      </button>

      {showModal && (
        <dialog
          ref={dialogRef}
          onClose={() => setShowModal(false)}
          className="m-auto rounded-xl border border-gray-800 shadow-2xl shadow-black/50 bg-[#131821] p-0 backdrop:bg-[#0B0F15]/80 backdrop:backdrop-blur-sm text-white"
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-4 min-w-[320px]">
            <h3 className="text-base font-bold text-gray-200">Flag as Outdated</h3>
            <p className="text-xs text-gray-400">
              Why do you think this answer needs updating?
              <span className="block mt-1 text-gray-500">(optional — max 200 chars)</span>
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 200))}
              placeholder="E.g. The process changed last week..."
              rows={3}
              className="w-full rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-none"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { dialogRef.current?.close(); setShowModal(false); }}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-black transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Submit Flag'}
              </button>
            </div>
            {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
          </form>
        </dialog>
      )}
    </>
  );
}