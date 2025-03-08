// src/components/Icons/PauseIcon/index.tsx
import React from 'react';

interface PauseIconProps {
    color?: string;
    size?: number | string;
    className?: string;
}

const PauseIcon: React.FC<PauseIconProps> = ({
    color = '#666',
    size = 24,
    className
}) => {
    return (
        <svg
            className={className}
            viewBox="0 0 1024 1024"
            width={size}
            height={size}
            role="img"
            aria-label="暂停图标"
        >
            <path
                d="M512 1024C232.95 1022.75 0.77 794.83 0 512 0 229.25 229.22 0 512 0s512 229.25 512 512c0 282.69-259.14 513.05-512 512zM512 114.21c-216.31 0-398.04 196.97-398.04 397.81 0 200.9 181.73 398.1 398.04 398.1s398.27-197.2 398.27-398.1c0-200.84-181.96-397.81-398.27-397.81zm128.15 573.8H384.11a48 48 0 0 1-48-48V384.05c0-26.5 21.5-48 48-48h256.01c26.45 0 47.95 21.5 47.95 48v255.96a48 48 0 0 1-47.95 48z"
                fill={color}
            />
        </svg>
    );
};

export default PauseIcon;