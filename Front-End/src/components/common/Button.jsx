const Button = ({
  children,
  as: Component = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const baseStyles =
    "font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-100 transform hover:-translate-y-0.5 hover:shadow-md disabled:transform-none",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-100",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-100",
    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-100",
    danger_outline:
        "border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-100",
    ghost: "text-blue-600 hover:bg-blue-50 focus:ring-blue-100",
    gradient:
      "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 focus:ring-indigo-100",
    dark: "bg-gray-900 text-white hover:bg-black focus:ring-gray-300",
    light:
      "bg-white text-gray-700 border border-gray-200 hover:bg-gray-200 focus:ring-gray-100 transform hover:-translate-y-0.5 hover:text-black",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3.5 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <Component
      type={Component === "button" ? type : undefined}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Chargement...</span>
        </span>
      ) : (
        children
      )}
    </Component>
  );
};

export default Button;
