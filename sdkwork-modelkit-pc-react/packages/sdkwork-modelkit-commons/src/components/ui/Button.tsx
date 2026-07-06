import React from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;
  disabled?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  className = '',
  onClick,
  title,
  disabled
}: ButtonProps) {
  const baseStyles = "px-3 py-1.5 text-[11px] rounded transition-colors font-semibold flex items-center justify-center gap-1.5";
  const variants = {
    primary: "bg-primary-main hover:bg-primary-hover text-white",
    secondary: "bg-surface-hover hover:bg-surface-hover border border-divider-strong text-text-main",
    danger: "bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
