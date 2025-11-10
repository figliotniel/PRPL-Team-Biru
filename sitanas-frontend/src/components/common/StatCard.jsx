import React from 'react';

function StatCard({ label, value, unit, icon, color }) {
  const iconClass = `fas ${icon}`;
  
  return (
    <div className="card card-stat" style={{ borderLeft: `5px solid ${color}` }}>
      <div className="card-body">
        <div className="stat-content">
          <h5 className="stat-title">{label}</h5>
          <h1 className="stat-value">
            {value}
            {unit && <span className="stat-unit">{unit}</span>}
          </h1>
        </div>
        <div className="stat-icon" style={{ color }}>
          <i className={iconClass}></i>
        </div>
      </div>
    </div>
  );
}

export default StatCard;