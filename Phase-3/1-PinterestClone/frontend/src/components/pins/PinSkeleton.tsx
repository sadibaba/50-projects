export default function PinSkeleton() {
  return (
    <div className="masonry-item animate-pulse">
      <div className="h-64 rounded-2xl bg-gray-200" />
      <div className="mt-2 h-3 w-4/5 rounded bg-gray-200" />
      <div className="mt-2 h-3 w-2/5 rounded bg-gray-100" />
    </div>
  );
}
