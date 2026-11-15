import React from 'react';

export const NeumorphicCard = ({
  children,
  className = '',
  inset = false,
  interactive = false,
  onClick,
  ...props
}) => {
  let baseStyle = 'rounded-3xl p-5 md:p-6 transition-all duration-150 ';

  if (inset) {
    baseStyle += 'shadow-neu-pressed border border-slate-200/50 dark:border-slate-800 ';
  } else {
    baseStyle += 'neu-card ';
  }

  if (interactive) {
    baseStyle += 'cursor-pointer hover:shadow-neu-flat-lg active:shadow-neu-pressed active:scale-[0.99] ';
  }

  return (
    <div
      className={`${baseStyle} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default NeumorphicCard;
