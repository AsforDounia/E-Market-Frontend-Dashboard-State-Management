import { useState, useEffect, useRef } from "react";

const Dropdown = ({
  trigger,
  children,
  position = "right",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const positions = {
    left: "right-0",
    right: "right-0",
    center: "left-1/2 transform -translate-x-1/2",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={`absolute ${positions[position]} mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 ${className}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, onClick, icon, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-3 ${className}`}
    >
      {icon && <span className="text-gray-600">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Dropdown;
