import { IndicadorEducacional, MediaEnem, Despesa } from "../types"; // Import types

type DataItem = Record<string, any>; // Generic record type

/**
 * Calculates the average of numeric properties (excluding specified keys) for an array of objects.
 * Ignores zero values in the calculation.
 *
 * @param dados - Array of data objects.
 * @param excludeKeys - Array of keys to exclude from averaging.
 * @returns A record containing the average for each valid numeric key.
 */
export function calcularMedias<T extends DataItem>(
    dados: T[],
    excludeKeys: string[] = ['ano', 'id', 'ibge_id', 'dependencia_id'] // Default keys to exclude
): Record<string, number> {

  if (!dados || dados.length === 0) {
      console.warn("calcularMedias: Received empty or invalid data array.");
      return {};
  }

  // Dynamically get keys from the first valid item, ensuring it's an object
  const firstValidItem = dados.find(item => typeof item === 'object' && item !== null);
  if (!firstValidItem) {
      console.warn("calcularMedias: No valid objects found in the data array.");
      return {};
  }

  // Filter keys: numeric, not excluded, and exists in the first item
  const numericKeys = Object.keys(firstValidItem).filter(key =>
      !excludeKeys.includes(key) &&
      typeof firstValidItem[key] === 'number'
  );

  if (numericKeys.length === 0) {
      console.warn("calcularMedias: No valid numeric keys found for averaging.");
      return {};
  }

  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};
  numericKeys.forEach(key => {
      sums[key] = 0;
      counts[key] = 0;
  });

  // Iterate through data, summing valid numeric values (excluding zero)
  dados.forEach(item => {
      if (typeof item === 'object' && item !== null) {
         numericKeys.forEach(key => {
              const value = item[key];
              // Check if the value is a valid number and not zero
              if (typeof value === 'number' && !isNaN(value) && value !== 0) {
                  sums[key] += value;
                  counts[key]++;
              }
          });
      }
  });

  // Calculate averages, formatting to 2 decimal places
  const medias: Record<string, number> = {};
  numericKeys.forEach(key => {
      medias[key] = counts[key] > 0
          ? parseFloat((sums[key] / counts[key]).toFixed(2))
          : 0; // Return 0 if no valid data points were found for the key
  });

  return medias;
}

// Example usage (can be removed from final code):
/*
const enemData: MediaEnem[] = [
    { ano: '2021', nome: 'City A', media_geral: 550.5, media_mt: 580.1 },
    { ano: '2021', nome: 'City B', media_geral: 600.2, media_mt: 610 },
    { ano: '2022', nome: 'City A', media_geral: 560.8, media_mt: 0 }, // MT is 0, will be ignored
];
const avgEnem = calcularMedias(enemData, ['ano', 'id']); // Exclude 'ano' and 'id'
console.log(avgEnem); // Should output { media_geral: 570.5, media_mt: 595.05 } (avg of 580.1 and 610)
*/
