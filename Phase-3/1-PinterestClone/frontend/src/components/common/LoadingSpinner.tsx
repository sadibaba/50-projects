const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };

export default function LoadingSpinner({ size = "md" }: { size?: keyof typeof sizes }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className={`${sizes[size]} animate-spin rounded-full border-2 border-gray-200 border-t-brand`} />
    </div>
  );
}
