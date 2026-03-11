export default function AnalyzingLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-black animate-spin" />
      <p className="text-sm text-muted-foreground">Analyzing...</p>
    </div>
  )
}