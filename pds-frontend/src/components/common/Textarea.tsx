import React from 'react';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  showCounter?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      required,
      maxLength,
      showCounter = true,
      className,
      disabled,
      value,
      ...rest
    },
    ref
  ) => {
    const [charCount, setCharCount] = React.useState(
      typeof value === 'string' ? value.length : 0
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      rest.onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            onChange={handleChange}
            className={clsx(
              'w-full px-4 py-2 border rounded-lg transition-all duration-200 resize-vertical min-h-[120px]',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
              {
                'border-red-500 focus:ring-red-500': error,
                'border-gray-300': !error,
              },
              className
            )}
            {...rest}
          />

          {error && (
            <div className="absolute top-2 right-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-1">
          <div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
          </div>
          {maxLength && showCounter && (
            <span className="text-xs text-gray-500">
              {charCount} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
