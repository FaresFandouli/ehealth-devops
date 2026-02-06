import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hover = false,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const variantClasses = {
      default: 'bg-white border border-gray-200',
      outlined: 'border-2 border-gray-300 bg-white',
      elevated: 'bg-white shadow-lg',
    };

    const paddingClasses = {
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-lg transition-all duration-200',
          variantClasses[variant],
          paddingClasses[padding],
          hover && 'hover:shadow-lg hover:-translate-y-1 cursor-pointer',
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  children,
  className,
  ...rest
}) => (
  <div
    className={clsx('flex items-start justify-between mb-4', className)}
    {...rest}
  >
    <div>
      {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
    {children}
  </div>
);

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardBody: React.FC<CardBodyProps> = ({ children, className, ...rest }) => (
  <div className={clsx('', className)} {...rest}>
    {children}
  </div>
);

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className, ...rest }) => (
  <div
    className={clsx('border-t border-gray-200 pt-4 mt-4 flex items-center justify-end gap-2', className)}
    {...rest}
  >
    {children}
  </div>
);

export default Card;
