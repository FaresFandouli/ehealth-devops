import React from 'react';
import clsx from 'clsx';
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message?: string;
  closeable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      type = 'info',
      title,
      message,
      closeable = false,
      onClose,
      icon,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);

    const handleClose = () => {
      setIsVisible(false);
      onClose?.();
    };

    if (!isVisible) return null;

    const typeConfig = {
      success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: <CheckCircle className="h-5 w-5" />,
      },
      error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: <AlertCircle className="h-5 w-5" />,
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        icon: <AlertTriangle className="h-5 w-5" />,
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: <Info className="h-5 w-5" />,
      },
    };

    const config = typeConfig[type];

    return (
      <div
        ref={ref}
        className={clsx(
          'border rounded-lg p-4 flex gap-3',
          config.bg,
          config.border,
          config.text,
          className
        )}
        {...rest}
      >
        <div className="flex-shrink-0 mt-0.5">
          {icon || config.icon}
        </div>

        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          {message && <p className="text-sm">{message}</p>}
          {children}
        </div>

        {closeable && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
