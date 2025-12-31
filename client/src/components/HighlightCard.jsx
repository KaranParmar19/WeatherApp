import React from 'react';
import './DashboardGrid.css';

const HighlightCard = ({ title, value, unit, icon: Icon, subText }) => {
    return (
        <div className="highlight-card">
            <div className="highlight-header">
                {Icon && <Icon size={18} />}
                <span>{title}</span>
            </div>
            <div className="highlight-content">
                <div className="highlight-value">
                    {value} <span style={{ fontSize: '1rem', opacity: 0.7 }}>{unit}</span>
                </div>
                {subText && <div className="highlight-sub">{subText}</div>}
            </div>
        </div>
    );
};

export default HighlightCard;
