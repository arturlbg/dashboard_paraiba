export function calcularMedias<T extends Record<string, any>>(dados: T[]): Record<string, number> {
  if (dados.length === 0) return {};

  const chaves = Object.keys(dados[0]).filter(
      (k) => {
          const valor = dados[0][k];
          return (
              typeof valor === "number" && 
              k !== "ano" && 
              k !== "id" && 
              k !== "ibge_id" && 
              k !== "dependencia_id"
          );
      }
  );

  if (chaves.length === 0) return {};

  const soma: Record<string, number> = {};
  chaves.forEach((k) => (soma[k] = 0));

  const contagem: Record<string, number> = {};
  chaves.forEach((k) => (contagem[k] = 0));

  dados.forEach((item) => {
      chaves.forEach((k) => {
          const valor = item[k];
          if (typeof valor === "number" && valor !== 0) {
              soma[k] += valor;
              contagem[k]++;
          }
      });
  });

  // Calculate averages
  const medias: Record<string, number> = {};
  chaves.forEach((k) => {
      // Only calculate average if we have valid entries
      medias[k] = contagem[k] > 0 
          ? parseFloat((soma[k] / contagem[k]).toFixed(2)) 
          : 0;
  });

  return medias;
}