import React from 'react';
import clsx from 'clsx';
import { Loader } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      rounded = 'md',
      children,
      disabled,
      className,
      ...rest
    },
    ref
  ) => {
    const variantClasses = {
      primary:
        'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400',
      secondary:
        'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 disabled:bg-purple-400',
      danger:
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-400',
      success:
        'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:bg-green-400',
      outline:
        'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 disabled:border-blue-400 disabled:text-blue-400',
      ghost:
        'text-blue-600 hover:bg-blue-50 active:bg-blue-100 disabled:text-blue-400',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const roundedClasses = {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={clsx(
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          roundedClasses[rounded],
          fullWidth && 'w-full',
          className
        )}
        {...rest}
      >
        {icon && iconPosition === 'left' && !isLoading && (
          <span className="mr-2">{icon}</span>
        )}
        {isLoading && (
          <Loader className="mr-2 h-4 w-4 animate-spin" />
        )}
        {children}
        {icon && iconPosition === 'right' && !isLoading && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
