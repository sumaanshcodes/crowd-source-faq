import React, { useEffect, useState } from 'react';
import api, { friendlyError } from '../../utils/api';

interface HistoryModalProps {
  faqId: string;
  faqQuestion: string;
  onClose: () => void;
}

interface HistoryEntry {
  _id: string;
  action: string;
  changedBy?: { name?: string };
  changedAt: string;
  from?: string;
  to?: string;
}

export default function HistoryModal({ faqId, faqQuestion, onClose }: HistoryModalProps) {
  const [logs, setLogs] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.get(`/faq/${faqId}/history`)
      .then((res) => {
        if (isMounted) setLogs(res.data.logs || []);
      })
      .catch((err) => {
        console.error(friendlyError(err, 'Failed to load history.'));
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [faqId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0B0F15]/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#131821] rounded-xl shadow-2xl shadow-black/50 border border-gray-800 max-h-[80vh] flex flex-col font-sans">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-sm font-bold text-gray-200">Verification History</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none transition-colors">&times;</button>
        </div>
        
        <div className="px-6 py-4 border-b border-gray-800/50 bg-gray-900/30">
          <p className="text-sm text-gray-400 font-medium line-clamp-2 leading-snug">{faqQuestion}</p>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <span className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></span>
            </div>
          ) : logs.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-8">No verification history found.</p>
          ) : (
            logs.map((entry) => (
              <div key={entry._id} className="flex items-start gap-4 text-sm group">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <div className="flex-1 min-w-0 pb-4 border-b border-gray-800/50 group-last:border-0 group-last:pb-0">
                  <p className="text-gray-300 font-medium">
                    {entry.action} {entry.to && <span className="text-emerald-400">→ {entry.to}</span>}
                  </p>
                  {entry.changedBy && (
                    <p className="text-gray-500 text-xs mt-1">
                      by {entry.changedBy.name || 'System'} · {new Date(entry.changedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}