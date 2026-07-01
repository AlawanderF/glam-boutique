export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="skeleton aspect-[3/4] w-full" />
      <div className="mt-3.5 flex flex-col gap-2">
        <div className="skeleton h-2.5 w-1/3" />
        <div className="skeleton h-3.5 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-4 w-1/4" />
      </div>
    </div>
  );
}
