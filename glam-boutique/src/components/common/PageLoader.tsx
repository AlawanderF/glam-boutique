export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center" role="status" aria-label="Carregando página">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-gold-500" />
        <span className="text-2xs uppercase tracking-widest2 text-ink-400">Carregando</span>
      </div>
    </div>
  );
}
