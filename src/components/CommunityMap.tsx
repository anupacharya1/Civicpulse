import { useState } from 'react';
import { communities } from '@/data/sampleData';
import type { CommunityId } from '@/data/types';
import { useStore } from '@/store/StoreContext';

const statusColor: Record<string, string> = {
  Good: '#3e8d57',
  Stable: '#df9d36',
  'Needs Attention': '#c0504a',
};

export function CommunityMap({ compact = false }: { compact?: boolean }) {
  const { reports, projects, selectedCommunity, setSelectedCommunity, setView } = useStore();
  const [hover, setHover] = useState<string | null>(null);

  const reportCount = (id: CommunityId) =>
    reports.filter((r) => r.community === id && r.status !== 'Resolved').length;
  const projectCount = (id: CommunityId) =>
    projects.filter((p) => p.community === id && p.status !== 'Completed').length;

  const active = hover ?? selectedCommunity;
  const activeCommunity = communities.find((c) => c.id === active);

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 100 100" className="w-full h-auto" role="img" aria-label="Community map">
        {/* background terrain */}
        <defs>
          <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6f2ea" />
            <stop offset="100%" stopColor="#ece5d6" />
          </linearGradient>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M10 0H0V10" fill="none" stroke="#ddd2bb" strokeWidth="0.3" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" rx="8" fill="url(#land)" />
        <rect width="100" height="100" rx="8" fill="url(#grid)" />

        {/* river */}
        <path
          d="M-2 62 Q20 55 32 60 T58 58 Q72 56 102 64"
          fill="none"
          stroke="#aec9cd"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M-2 62 Q20 55 32 60 T58 58 Q72 56 102 64"
          fill="none"
          stroke="#7ea7ae"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeDasharray="2 3"
          opacity="0.8"
        />

        {/* connecting roads */}
        {communities.map((c, i) =>
          communities.slice(i + 1).map((c2, j) => {
            if (Math.abs(c.x - c2.x) + Math.abs(c.y - c2.y) > 60) return null;
            return (
              <line
                key={`${c.id}-${c2.id}-${j}`}
                x1={c.x}
                y1={c.y}
                x2={c2.x}
                y2={c2.y}
                stroke="#c4b694"
                strokeWidth="0.8"
                strokeDasharray="1.5 1.2"
                opacity="0.5"
              />
            );
          }),
        )}

        {/* community markers */}
        {communities.map((c) => {
          const isSel = c.id === selectedCommunity;
          const isHover = c.id === hover;
          const rc = reportCount(c.id);
          const color = statusColor[c.status];
          const r = isSel ? 3.2 : isHover ? 2.8 : 2.4;
          return (
            <g
              key={c.id}
              onMouseEnter={() => setHover(c.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setSelectedCommunity(c.id)}
              style={{ cursor: 'pointer' }}
            >
              {isSel && (
                <circle cx={c.x} cy={c.y} r={r + 2.5} fill={color} opacity="0.2">
                  <animate attributeName="r" values={`${r + 1};${r + 4};${r + 1}`} dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.25;0;0.25" dur="2.4s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={c.x} cy={c.y} r={r + 1.2} fill="white" opacity="0.9" />
              <circle cx={c.x} cy={c.y} r={r} fill={color} />
              {rc > 0 && (
                <circle cx={c.x + r + 0.5} cy={c.y - r - 0.5} r="1.6" fill="#c0504a" />
              )}
              <text
                x={c.x}
                y={c.y + r + 3.2}
                textAnchor="middle"
                fontSize="2.4"
                fontWeight="700"
                fill="#1f444d"
                opacity={isSel || isHover ? 1 : 0.75}
                style={{ pointerEvents: 'none' }}
              >
                {c.name}
              </text>
            </g>
          );
        })}

        {/* legend dots inside map */}
        {!compact && (
          <g style={{ pointerEvents: 'none' }}>
            <circle cx="6" cy="92" r="1.4" fill="#3e8d57" />
            <text x="9" y="93" fontSize="2.2" fill="#1f444d">Good</text>
            <circle cx="22" cy="92" r="1.4" fill="#df9d36" />
            <text x="25" y="93" fontSize="2.2" fill="#1f444d">Stable</text>
            <circle cx="38" cy="92" r="1.4" fill="#c0504a" />
            <text x="41" y="93" fontSize="2.2" fill="#1f444d">Needs attention</text>
            <circle cx="62" cy="92" r="1.4" fill="#c0504a" />
            <text x="65" y="93" fontSize="2.2" fill="#1f444d">Active reports</text>
          </g>
        )}
      </svg>

      {/* hover/selected info card */}
      {activeCommunity && (
        <div className="absolute left-3 top-3 bg-white/95 backdrop-blur rounded-xl shadow-soft border border-sand-200 px-3 py-2.5 max-w-[200px] animate-fade-in">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: statusColor[activeCommunity.status] }} />
            <p className="font-bold text-sm text-ink-800">{activeCommunity.name}</p>
          </div>
          <p className="text-[11px] text-ink-400 mb-1.5">{activeCommunity.tagline}</p>
          <div className="flex gap-3 text-[11px] font-semibold">
            <span className="text-danger-500">{reportCount(activeCommunity.id)} reports</span>
            <span className="text-ink-500">{projectCount(activeCommunity.id)} projects</span>
          </div>
          <button
            onClick={() => {
              setSelectedCommunity(activeCommunity.id);
              setView('pulse');
            }}
            className="mt-2 text-[11px] font-bold text-amber-600 hover:text-amber-700"
          >
            View community →
          </button>
        </div>
      )}
    </div>
  );
}
