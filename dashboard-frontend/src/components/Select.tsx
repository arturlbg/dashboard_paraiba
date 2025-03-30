import React from 'react';

interface SelectProps<T> {
  data: T[];
  value: T | null;
  onChange: (value: T) => void;
  labelKey: string;
}

const Select = <T extends Record<string, any>>({
  data,
  value,
  onChange,
  labelKey
}: SelectProps<T>): JSX.Element => {
  return (
    <select
      className="p-2 border rounded-md"
      value={value ? value[labelKey] : ''}
      onChange={(e) => {
        const selected = data.find(item => item[labelKey] === e.target.value);
        if (selected) {
          onChange(selected);
        }
      }}
    >
      <option value="">Selecione...</option>
      {data.map((item, index) => (
        <option key={index} value={item[labelKey]}>
          {item[labelKey]}
        </option>
      ))}
    </select>
  );
};

export default Select;