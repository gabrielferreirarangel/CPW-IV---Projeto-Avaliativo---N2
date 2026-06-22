import React from 'react';

export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  icon: Icon,
  type = 'button',
  className = '',
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : (
        <>
          {Icon && <Icon />}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;