const StarRating = ({
  rating = 0,
  maxStars = 5,
  size = "md",
  showValue = false,
  className = "",
}) => {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex gap-1 text-amber-500 ${sizes[size]}`}>
        {[...Array(maxStars)].map((_, index) => (
          <span key={index}>{index < Math.round(rating) ? "★" : "☆"}</span>
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-gray-600 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
