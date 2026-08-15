import type { ReactNode } from 'react';

export function Card({
  children,
  className = '',
  onClick,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-[#fbf9f3] border border-sand-200/80 shadow-soft ${
        hover ? 'transition-all duration-200 hover:shadow-soft-lg hover:-translate-y-0.5' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
  icon,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-start gap-2.5 min-w-0">
        {icon && <div className="mt-0.5 text-ink-500 shrink-0">{icon}</div>}
        <div className="min-w-0">
          <h2 className="font-display-serif text-lg font-bold text-ink-800 leading-tight">{title}</h2>
          {subtitle && <p className="text-sm text-ink-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function ViewAllButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-sm font-semibold text-ink-500 hover:text-ink-700 transition-colors whitespace-nowrap flex items-center gap-1"
    >
      View all
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="inline">
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function Badge({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'amber' | 'success' | 'warning' | 'danger' | 'ink';
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-sand-100 text-ink-600',
    amber: 'bg-amber-100 text-amber-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-danger-100 text-danger-600',
    ink: 'bg-ink-100 text-ink-700',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  className = '',
  tone = 'ink',
}: {
  value: number;
  className?: string;
  tone?: 'ink' | 'amber' | 'success';
}) {
  const colors: Record<string, string> = {
    ink: 'bg-ink-500',
    amber: 'bg-amber-400',
    success: 'bg-success-500',
  };
  return (
    <div className={`h-2 rounded-full bg-sand-200 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full ${colors[tone]} transition-all duration-700 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'amber' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  const variants: Record<string, string> = {
    primary: 'bg-ink-700 text-white hover:bg-ink-800 shadow-soft',
    secondary: 'bg-[#fbf9f3] text-ink-700 border border-sand-300 hover:bg-sand-50',
    ghost: 'text-ink-600 hover:bg-sand-100',
    amber: 'bg-amber-400 text-ink-900 hover:bg-amber-300 shadow-soft font-semibold',
    danger: 'bg-danger-500 text-white hover:bg-danger-600',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export function EmptyState({
  icon,
  title,
  message,
}: {
  icon: ReactNode;
  title: string;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="w-14 h-14 rounded-2xl bg-sand-100 text-ink-300 flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="font-semibold text-ink-700">{title}</p>
      <p className="text-sm text-ink-400 mt-1 max-w-xs">{message}</p>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  children,
  title,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  if (!open) return null;
  const sizes: Record<string, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`relative bg-[#fbf9f3] rounded-t-3xl sm:rounded-3xl shadow-soft-xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto animate-scale-in`}
      >
        {title && (
          <div className="sticky top-0 bg-[#fbf9f3] border-b border-sand-200 px-5 py-4 rounded-t-3xl flex items-center justify-between">
            <h3 className="font-display-serif font-bold text-ink-800 text-lg">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-sand-100 flex items-center justify-center text-ink-400"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
