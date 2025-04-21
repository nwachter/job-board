// components/auth/FormField.tsx
import React from 'react';

type FormFieldProps = {
    icon: React.ReactNode;
    error?: string;
    label?: string; // Optional label for accessibility
} & React.InputHTMLAttributes<HTMLInputElement>;

const FormField: React.FC<FormFieldProps> = ({ icon, error, label, id, className, ...props }) => {
    const inputId = id || props.name;
    return (
        <div className="w-full">
            {label && <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <div className="relative">
                {/* Adjust size using Tailwind's arbitrary child selector */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 [&>svg]:w-[18px] [&>svg]:h-[18px]">
                     {/* Render the icon directly */}
                    {icon}
                </div>
                <input
                    id={inputId}
                    {...props}
                    // Adjust padding if needed due to icon size change
                    className={`
                        w-full pl-10 pr-4 py-2.5 rounded-lg border
                        ${error ? 'border-red-500' : 'border-gray-300'}
                        focus:outline-none focus:ring-2
                        ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-purple-500 focus:border-purple-500'}
                        focus:border-transparent transition duration-150 ease-in-out
                        disabled:bg-gray-100 disabled:cursor-not-allowed
                        ${className}
                    `}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                />
            </div>
            {error && <p id={`${inputId}-error`} className="text-red-500 text-xs mt-1 pl-1">{error}</p>}
        </div>
    );
};

export default FormField;