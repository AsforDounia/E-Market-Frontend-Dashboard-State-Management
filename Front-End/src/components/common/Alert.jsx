import { Link } from "react-router-dom";
import Button from "./Button";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
const Alert = ({
  type = "info",
  message,
  onClose,
  className = "",
  links = [],
}) => {
  const types = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: <FaCheckCircle />,
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: <FaTimesCircle />,
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      icon: <FaExclamationTriangle />,
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      icon: <FaInfoCircle />,
    },
  };

  const alertType = types[type] || types.info;

  return (
    <div
      className={`${alertType.bg} border ${alertType.border} ${alertType.text} px-4 py-3 rounded-lg gap-3 ${className}`}
      role="alert"
    >
      {onClose && (
        <div className="w-full grid justify-end ">
          <Button
            children={<FaTimesCircle />}
            onClick={onClose}
            variant="secondary"
            size=""
            className="shrink-0 text-current hover:opacity-70 focus:outline-none p-0"
          />
        </div>
      )}

      <div>
        <div className="flex gap-4 items-center p-4">
          <span className="text-5xl">{alertType.icon}</span>
          <p className="text-sm grow">{message}</p>
        </div>
        <div>
          {links.length > 0 && (
            <>
              {links.length > 0 && (
                <div className="flex flex-wrap gap-8 justify-center mt-2 ">
                  {links.map((link, index) => (
                    <Link key={index} to={link.to}>
                      <Button variant={link.variant} size="sm">
                        {link.icon && <span className="mr-1">{link.icon}</span>}
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;
