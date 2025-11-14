const Card = ({
  children,
  hover = false,
  padding = "md",
  className = "",
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-8",
  };

  const hoverEffect = hover
    ? "transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    : "";

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden ${hoverEffect} ${paddings[padding]} ${className}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};

export default Card;
