export function BarbellDivider() {
  return (
    <div className="flex items-center justify-center gap-3 px-4 py-6" aria-hidden>
      <span className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-border" />
      <svg
        viewBox="0 0 120 24"
        className="h-5 w-20 text-primary/50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="10" width="8" height="4" rx="1" fill="currentColor" />
        <rect x="10" y="8" width="6" height="8" rx="1" fill="currentColor" opacity="0.7" />
        <rect x="16" y="11" width="88" height="2" rx="1" fill="currentColor" />
        <rect x="104" y="8" width="6" height="8" rx="1" fill="currentColor" opacity="0.7" />
        <rect x="110" y="10" width="8" height="4" rx="1" fill="currentColor" />
      </svg>
      <span className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-border" />
    </div>
  );
}
