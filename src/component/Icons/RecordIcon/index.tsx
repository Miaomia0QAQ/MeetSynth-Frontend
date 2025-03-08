// src/components/Icons/RecordIcon/index.tsx
import React from 'react';

interface RecordIconProps {
    size?: number | string;
    className?: string;
}

const RecordIcon: React.FC<RecordIconProps> = ({
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
            aria-label="录音图标"
        >
            <path
                d="M356.98680921 515.89397111a155.01319079 155.01319079 0 1 0 310.02638158 0 155.01319079 155.01319079 0 1 0-310.02638158 0z"
                fill="#d81e06"
            />
            <path
                d="M512 68.032A447.488 447.488 0 0 0 65.024 515.008 447.424 447.424 0 0 0 512 961.984a447.424 447.424 0 0 0 446.976-446.976A447.424 447.424 0 0 0 512 68.032z m0 829.952c-211.2 0-382.976-171.84-382.976-382.976S300.8 132.032 512 132.032s382.976 171.84 382.976 382.976S723.2 897.984 512 897.984z"
                fill="#666"
            />
        </svg>
    );
};

export default RecordIcon;