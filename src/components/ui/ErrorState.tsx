"use client";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#ffb2b7]/10 flex items-center justify-center mb-6">
        <i className="fi fi-rr-triangle-warning text-3xl text-[#ffb2b7]" />
      </div>
      <h3 className="text-xl font-bold text-[#dee3ec] mb-2">Error</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#252a32] hover:bg-[#30353d] border border-[#464554]/20 text-sm font-bold text-[#c0c1ff] transition-all hover:scale-[1.02] active:scale-95"
        >
          <i className="fi fi-rr-refresh text-xs" />
          Retry
        </button>
      )}
    </div>
  );
}
