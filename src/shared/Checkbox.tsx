import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div className="flex items-center mb-4">
        <input
          ref={ref}
          type="checkbox"
          className={`
            h-4 w-4 text-blue-600 border-gray-300 rounded
            focus:ring-2 focus:ring-blue-500
            ${className}
          `}
          {...props}
        />
        <label className="ml-2 block text-sm text-gray-700">
          {label}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
