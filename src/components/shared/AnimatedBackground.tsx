export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Desktop: Animated purple and pink blobs with heavy blur */}
      <div className="hidden md:block absolute inset-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-400/30 rounded-full animate-blob blur-[120px]"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400/30 rounded-full animate-blob animation-delay-4000 blur-[120px]"></div>
        <div className="absolute -bottom-8 right-20 w-96 h-96 bg-pink-400/30 rounded-full animate-blob animation-delay-2000 blur-[120px]"></div>
      </div>
      
      {/* Mobile: Light gradient */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-60"></div>
    </div>
  );
}
