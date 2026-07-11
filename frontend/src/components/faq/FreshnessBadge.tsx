import React from 'react';

interface FreshnessBadgeProps {
  reviewStatus: 'verified' | 'pending_review' | 'update_requested' | undefined;
  lastVerifiedDate: string | Date | undefined;
  reviewIntervalDays: number;
  freshnessTier: 'evergreen' | 'seasonal' | 'volatile' | undefined;
  compact?: boolean;
}

function daysSince(date: Date): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

export default function FreshnessBadge({
  reviewStatus = 'verified',
  lastVerifiedDate,
  reviewIntervalDays,
  freshnessTier,
  compact = false,
}: FreshnessBadgeProps) {
  if (!lastVerifiedDate) return null;

  const days = daysSince(new Date(lastVerifiedDate));
  const isEvergreen = freshnessTier === 'evergreen' || !freshnessTier;

  if (reviewStatus === 'pending_review') {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-md ${compact ? 'text-[10px]' : ''}`}>
        ⏳ Under review
      </span>
    );
  }

  if (reviewStatus === 'update_requested') {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-md ${compact ? 'text-[10px]' : ''}`}>
        ⚠️ Update requested
      </span>
    );
  }

  if (isEvergreen) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs text-emerald-400 ${compact ? '' : 'font-medium'}`}>
        ✓ Verified
      </span>
    );
  }

  const nearingExpiry = reviewIntervalDays > 0 && days >= reviewIntervalDays * 0.8;

  if (nearingExpiry) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-yellow-500 font-medium">
        ✓ Verified {days}d ago
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
      ✓ Verified {days}d ago
    </span>
  );
}