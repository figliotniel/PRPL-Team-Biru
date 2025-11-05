// src/components/common/StatCard.jsx
import React from 'react';

const StatCard = ({ icon, color, label, value, unit = '' }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color + '30' }}> {/* Tambahkan transparansi */}
        <i className={`fas ${icon}`} style={{ color: color }}></i>
      </div>
      <div className="stat-info">
        <span className="stat-value">{value}{unit}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
};

export default StatCard;