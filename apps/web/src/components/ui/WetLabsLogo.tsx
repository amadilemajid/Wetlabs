export function WetLabsLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Rounded square background - Navy Blue #05734e */}
      <rect x="5" y="5" width="90" height="90" rx="18" fill="#05734e"/>
      
      {/* Reed motif - White #ffffff - Three curved reeds */}
      {/* Left reed (shortest) */}
      <path d="M 30 70 Q 28 55 32 48 Q 34 44 36 48 Q 40 55 38 70 Z" fill="#ffffff"/>
      
      {/* Center reed (tallest) */}
      <path d="M 45 70 Q 42 45 48 35 Q 50 30 52 35 Q 58 45 55 70 Z" fill="#ffffff"/>
      
      {/* Right reed (medium) */}
      <path d="M 60 70 Q 58 50 62 43 Q 64 39 66 43 Q 70 50 68 70 Z" fill="#ffffff"/>
    </svg>
  );
}
