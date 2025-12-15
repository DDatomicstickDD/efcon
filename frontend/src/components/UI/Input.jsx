import React from 'react';
import './styles/input.css';

const Input = ({ label, type = 'text', value, onChange, placeholder, unit, min, max, step, className = '' }) => {
  return (
    <div className={`input-container ${className}`}>
      <label className="input-label">{label}</label>
      <div className="input-wrapper">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className="input-field"
        />
        {unit && <span className="input-unit">{unit}</span>}
      </div>
    </div>
  );
};

export default Input;