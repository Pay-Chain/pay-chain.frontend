export default function Loading() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center animate-fade-in">
      {/* Gradient Spinner */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-white/10" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-accent-purple animate-spin" />
      </div>
      
      {/* Loading Text */}
      <p className="text-muted mt-6 animate-pulse">Loading...</p>
    </div>
  );
}
