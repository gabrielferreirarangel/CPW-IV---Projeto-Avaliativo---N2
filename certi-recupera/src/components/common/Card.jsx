import React from 'react';

export function Card({
  children,
  interactive = false,
  className = '',
  isMetric = false,
  metricIcon: Icon,
  metricValue,
  metricLabel,
  metricColor = 'primary',
  onClick,
  ...rest
}) {
  const cardClasses = `card ${interactive ? 'card-interactive' : ''} ${className}`;

  if (isMetric) {
    return (
      <div className={`${cardClasses} metric-card`} onClick={onClick} {...rest}>
        {Icon && (
          <div className={`metric-icon-wrapper ${metricColor}`}>
            <Icon />
          </div>
        )}
        <div className="metric-info">
          <span className="metric-value">{metricValue}</span>
          <span className="metric-label">{metricLabel}</span>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className={cardClasses} onClick={onClick} {...rest}>
      {children}
    </div>
  );
}

export default Card;
