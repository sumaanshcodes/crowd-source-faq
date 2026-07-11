import React, { useState } from 'react';
import api from '../../utils/api';
import { FAQItem } from './faqUtils';

interface ReportFAQButtonProps {
  item: FAQItem;
}

export default function ReportFAQButton({ item }: ReportFAQButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || reason.trim().length < 10) return;
    setError('');
    setLoading(true);
    try {
      await api.post(`/faq/${item._id}/report`, { reason });
      setDone(true);
      setReason('');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to submit report.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-6 flex items-center gap-1.5 text-[11px] font-medium text-gray-500 hover:text-red-400 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Report this question
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F15]/80 backdrop-blur-sm p-4">
          <div className="bg-[#131821] rounded-2xl border border-gray-800 shadow-2xl w-full max-w-sm p-5 font-sans">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Report FAQ</h3>
              <button onClick={() => { setOpen(false); setDone(false); setError(''); }} className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {done ? (
              <div className="text-center py-4">
                <span className="text-3xl">✅</span>
                <p className="mt-3 text-sm font-bold text-white">Report submitted.</p>
                <p className="mt-1 text-xs text-gray-400">Thank you for helping keep the FAQ accurate.</p>
                <button onClick={() => { setOpen(false); setDone(false); }} className="mt-5 w-full py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-xs font-medium text-white hover:bg-gray-700 transition-colors">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Is this FAQ inaccurate, outdated, or incorrect? Let us know why.
                </p>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Reason</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder="e.g. This answer is outdated, the policy changed..."
                    className="w-full rounded-xl border border-gray-700 bg-gray-900/50 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all resize-none"
                  />
                  <p className="text-[10px] text-gray-600 mt-1 text-right">{reason.length}/500</p>
                </div>
                {error && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setOpen(false); setError(''); }}
                    className="flex-1 py-2.5 rounded-xl border border-gray-700 text-xs font-semibold text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reason.trim().length < 10 || loading}
                    className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? 'Submitting…' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}