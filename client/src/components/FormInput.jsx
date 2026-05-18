import React, { useState } from 'react';

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  name,
  required = false,
  placeholder = '',
  showToggle = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType =
    isPassword && showToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div>
      {label && (
        <label className="block text-sm text-text-secondary mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-border rounded bg-white text-text-primary"
        />

        {isPassword && showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-text-secondary hover:text-text-primary"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
    </div>
  );
}
