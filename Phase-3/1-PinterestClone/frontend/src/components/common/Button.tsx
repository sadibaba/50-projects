import React from "react";

type Variant = "brand" | "dark" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  brand: "bg-brand text-white hover:bg-brand-dark",
  dark: "bg-ink text-white hover:bg-black",
  outline: "border border-gray-300 bg-white text-ink hover:bg-gray-50",
  ghost: "bg-transparent text-ink hover:bg-gray-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

const Button: React.FC<ButtonProps> = ({
  variant = "brand",
  size = "md",
  loading = false,
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}) => (
  <button
    className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? (
      <>
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Working...
      </>
    ) : (
      children
    )}
  </button>
);

export default Button;
