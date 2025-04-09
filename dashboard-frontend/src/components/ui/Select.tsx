import React from 'react';

// Define a type for the option items. They must have at least valueKey and labelKey properties.
type OptionType = Record<string, any>;

interface SelectProps<T extends OptionType> {
  id?: string; // Optional id for label association
  data: T[];
  value: T | null; // Allow null for no selection or clearable
  onChange: (value: T | null) => void; // Allow null for clearing
  labelKey: keyof T; // Key for display text
  valueKey: keyof T; // Key for option value (must be unique within data)
  placeholder?: string; // Placeholder text
  className?: string; // Allow external styling
  isDisabled?: boolean;
  isClearable?: boolean; // Add clearable functionality
  noOptionsMessage?: string | (() => string); // Message when data is empty
}

const Select = <T extends OptionType>({
  id,
  data,
  value,
  onChange,
  labelKey,
  valueKey,
  placeholder = "Selecione...",
  className = "",
  isDisabled = false,
  isClearable = false,
  noOptionsMessage = "Nenhuma opção",
}: SelectProps<T>): JSX.Element => {

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === "") {
      onChange(null);
    } else {
      const selected = data.find(item => String(item[valueKey]) === selectedValue);
      if (selected) {
        onChange(selected);
      } else {
          onChange(null);
      }
    }
  };

  const currentValue = value ? String(value[valueKey]) : "";
  const hasOptions = data && data.length > 0;

  const getNoOptionsMessage = () => {
      if (typeof noOptionsMessage === 'function') {
          return noOptionsMessage();
      }
      return noOptionsMessage;
  }

  return (
    <select
      id={id}
      className={`p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
      value={currentValue}
      onChange={handleSelectChange}
      disabled={isDisabled || !hasOptions}
    >
      {(placeholder || isClearable) && (
        <option value="" disabled={!isClearable}>
          {placeholder}
        </option>
      )}

      {hasOptions ? (
        data.map((item, index) => (
          <option key={String(item[valueKey]) ?? index} value={String(item[valueKey])}>
            {String(item[labelKey])}
          </option>
        ))
      ) : (
         !placeholder && <option value="" disabled>{getNoOptionsMessage()}</option>
      )}
    </select>
  );
};

export default Select;