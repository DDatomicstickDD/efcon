import React from 'react';
import './styles/slider.css';

const Slider = ({ label, min, max, step = 1, value, onChange, unit, className = '' }) => {
  return (
    <div className={`slider-container ${className}`}>
      <label className="slider-label">
        {label} <span className="slider-value">{value} {unit}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-input"
      />
      <div className="slider-min-max">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default Slider;