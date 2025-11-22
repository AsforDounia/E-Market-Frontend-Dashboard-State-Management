const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage = true,
  hasPreviousPage = true,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center items-center gap-4 ${className}`}>
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={!hasPreviousPage}
        className={`px-5 py-2 rounded-lg font-medium transition-all ${
          hasPreviousPage
            ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        ← Précédent
      </button>

      <span className="text-gray-700 font-medium">
        Page {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={!hasNextPage}
        className={`px-5 py-2 rounded-lg font-medium transition-all ${
          hasNextPage
            ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Suivant →
      </button>
    </div>
  );
};

export default Pagination;
