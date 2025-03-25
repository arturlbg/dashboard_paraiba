type EnemDados = {
    nome: string;
    ano: string;
    media_geral: number;
    media_cn: number;
    media_ch: number;
    media_lc: number;
    media_mt: number;
    media_red: number;
  };
  
export function calcularMedias(dados: EnemDados[]): Record<string, number> {
    if (dados.length === 0) return {};
  
    const soma: Record<string, number> = {};
    const chaves = Object.keys(dados[0]).filter(
      (k) => typeof dados[0][k as keyof EnemDados] === "number"
    );
  
    chaves.forEach((k) => (soma[k] = 0));
  
    dados.forEach((item) => {
      chaves.forEach((k) => {
        soma[k] += item[k as keyof EnemDados] as number;
      });
    });
  
    const medias: Record<string, number> = {};
    chaves.forEach((k) => {
      medias[k] = parseFloat((soma[k] / dados.length).toFixed(2));
    });
  
    return medias;
}
  