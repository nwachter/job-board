// components/auth/AuthFormField.tsx
import React from 'react';
import { Input } from "@/components/ui/input"; // Assuming shadcn/ui Input
import { Label } from "@/components/ui/label"; // Assuming shadcn/ui Label
import { TextField } from "radix-ui"; // Assuming you are using Radix UI for TextField


type AuthFormFieldProps = {
    icon: React.ReactNode;
    error?: string;
    label: string; // Add label for accessibility
    id: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const AuthFormField: React.FC<AuthFormFieldProps> = ({
    icon,
    error,
    label,
    id,
    className,
    ...props
}) => (
    <div className="space-y-1.5">
        {/* Optional: Add Label for better accessibility */}
    
        <Label htmlFor={id} className="text-sm font-medium text-gray-700 sr-only">{label}</Label>
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                {icon}
            </div>
            <TextField
                id={id}
                {...props}
                className={`w-full pl-10 pr-4 py-2.5 h-11 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`} // Use Input component, adjust styling
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
            />
        </div>
        {error && <p id={`${id}-error`} className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);