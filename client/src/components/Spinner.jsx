const Spinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex items-center justify-center py-8" role="status" aria-label="Loading">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-gray-300 border-t-gray-900`}
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
};

export default Spinner;
