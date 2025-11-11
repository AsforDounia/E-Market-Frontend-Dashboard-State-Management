const Input = ({ 
  label, 
  error, 
  type = 'text',
  id,
  placeholder,
  className = '',
  required = false,
  ...props 
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-100 ${
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-200 focus:border-blue-500'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-2">{error}</p>
      )}
    </div>
  );
};

export default Input;