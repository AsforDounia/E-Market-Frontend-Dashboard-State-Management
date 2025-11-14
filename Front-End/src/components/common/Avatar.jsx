const Avatar = ({ 
  avatarUrl, 
  fullname, 
  size = 'md',
  textSize,
  className = '',
  onClick,
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-32 h-32',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-4xl',
  };

  const sizeClass = typeof size === 'string' && sizes[size] ? sizes[size] : size;
  const textSizeClass = textSize || (typeof size === 'string' && textSizes[size]) || 'text-lg';

  return (
    <div 
      className={`${sizeClass} rounded-full overflow-hidden bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white ${textSizeClass} font-bold ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt={fullname} 
          className="w-full h-full object-cover" 
        />
      ) : (
        fullname?.charAt(0).toUpperCase()
      )}
    </div>
  );
};

export default Avatar;