import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, error, icon, className = "", ...props }) => (
  <div className="w-full">
    {label && <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>}
    <div className="relative">
      {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
      <input
        className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-brand/30 ${icon ? "pl-10" : ""} ${error ? "border-red-400" : "border-gray-300 focus:border-brand"} ${className}`}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export default Input;
