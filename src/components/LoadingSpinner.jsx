export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="card flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        <div className="text-white/80 text-sm">{label}</div>
      </div>
    </div>
  );
}