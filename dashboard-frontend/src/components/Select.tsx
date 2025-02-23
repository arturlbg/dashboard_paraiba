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
            value={JSON.stringify(value)}
            onChange={(e) => {
                const selectedItem = data.find(item => JSON.stringify(item) === e.target.value) as T;
                if (selectedItem) {
                    onChange(selectedItem);
                }
            }}
        >
            <option value="">Selecione uma opção</option>
            {data.map((item, index) => (
                <option key={index} value={JSON.stringify(item)}>
                    {String(item[labelKey] || item)}
                </option>
            ))}
        </select>
    );
}

  