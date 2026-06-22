import React from 'react';

export function Input({
  id,
  label,
  type = 'text',
  placeholder = '',
  icon: Icon,
  error,
  className = '',
  options = [],
  rows = 3,
  value,
  onChange,
  ...rest
}) {

  // ve se o campo vai ser select ou textarea

  const isSelect = type === 'select';
  const isTextarea = type === 'textarea';

  return (
    <div className={`input-wrapper ${className}`}>

      {/* mostra o texto do label se tiver */}

      {label && <label htmlFor={id}>{label}</label>}
      
      <div className={`input-container ${Icon ? 'has-icon' : ''}`}>

        {/* coloca o icone no campo caso exista */}

        {Icon && <Icon />}
        
        {isSelect ? (
          <select id={id} value={value} onChange={onChange} {...rest}>

            {/* monta as opcoes do select */}

            {options.map((opt, idx) => (
              <option key={opt.value || idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : isTextarea ? (
          <textarea
            id={id}
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...rest}
          />
        ) : (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...rest}
          />
        )}
      </div>
      
      {/* mostra o erro abaixo do campo */}

      {error && <span className="error-text">{error}</span>}
    </div>
  );
}

export default Input;