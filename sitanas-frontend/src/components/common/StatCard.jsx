import React from 'react';
// Asumsi Anda sudah memiliki styling untuk .card-stat, dll.

function StatCard({ title, value, iconClass, color }) {
  return (
    <div className="card card-stat" style={{ borderLeft: `5px solid ${color}` }}>
      <div className="card-body">
        <div className="stat-content">
          <h5 className="stat-title">{title}</h5>
          <h1 className="stat-value">{value}</h1>
        </div>
        <div className="stat-icon" style={{ color }}>
          <i className={iconClass}></i>
        </div>
      </div>
    </div>
  );
}

export default StatCard;