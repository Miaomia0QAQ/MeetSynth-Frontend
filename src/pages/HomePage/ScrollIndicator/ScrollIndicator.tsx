import { useEffect, useState } from "react";
import "./ScrollIndicator.css";

interface ScrollIndicatorProps {
    targetId?: string;
    onClick?: () => void;
}

const ScrollIndicator = ({ targetId, onClick }: ScrollIndicatorProps) => {

    const handleClick = () => {
        if (targetId) {
            const target = document.getElementById(targetId);
            target?.scrollIntoView({ behavior: "smooth" });
        }
        onClick?.();
    };

    return (
        <div className="scroll-indicator-container">
            <div className="arrow-wrapper" onClick={handleClick}>
                <div className="scroll-arrow" />
                <div className="scroll-dot" />
                <div className="scroll-dot" />
                <div className="scroll-dot" />
            </div>
        </div>
    );
};

export default ScrollIndicator;