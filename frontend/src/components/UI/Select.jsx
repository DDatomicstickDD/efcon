import React from 'react';
import './styles/select.css';

const Select = ({ label, value, onChange, options, className = '' }) => {
  return (
    <div className={`select-container ${className}`}>
      <label className="select-label">{label}</label>
      <select value={value} onChange={onChange} className="select-field">
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;