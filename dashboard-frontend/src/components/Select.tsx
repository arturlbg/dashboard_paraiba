interface Props<T> {
    data: Array<T>; // Aceita qualquer tipo de array
    value: T;
    onChange: (value: T) => void;
    labelKey: keyof T; // Chave do objeto que será usada como texto no select
  }
  
  export default function Select<T>({ data, value, onChange, labelKey }: Props<T>) {
    return (
      <select
        className="w-full sm:w-auto p-2 border rounded-lg hover:border-blue-500 transition-colors"
        value={JSON.stringify(value)} // Serializa para comparar objetos corretamente
        onChange={(e) => onChange(data.find(item => JSON.stringify(item) === e.target.value) as T)}
      >
        <option value="">Selecione uma opção</option>
        {data.map((item, index) => (
          <option key={index} value={JSON.stringify(item)}>
            {String(item[labelKey])}
          </option>
        ))}
      </select>
    );
  }
  