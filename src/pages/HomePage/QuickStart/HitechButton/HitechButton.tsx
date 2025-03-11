// HitechButton.tsx
import React from 'react';
import styles from './HitechButton.module.css';

interface HitechButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const HitechButton: React.FC<HitechButtonProps> = ({ 
  className = '',
  children,
  ...props
}) => {
  return (
    <button 
      className={`${styles.button} ${className}`}
      {...props}
    >
      <span className={styles.glow}></span>
      <span className={styles.content}>{children}</span>
    </button>
  );
};

export default HitechButton;