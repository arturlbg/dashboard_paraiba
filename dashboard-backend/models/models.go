package models

type Despesa struct {
	Ano           int     `json:"ano"`
	SiglaUF       string  `json:"sigla_uf"`
	SiglaUFNome   string  `json:"sigla_uf_nome"`
	IDMunicipio   int     `json:"id_municipio"`
	NomeMunicipio string  `json:"id_municipio_nome"`
	Estagio       string  `json:"estagio"`
	Conta         string  `json:"conta"`
	EstagioBD     string  `json:"estagio_bd"`
	ContaBD       string  `json:"conta_bd"`
	Valor         float64 `json:"valor"`
}

type NotaEnem struct {
	NUInscricao      string  `json:"nu_inscricao"`
	TPDependenciaADM float64 `json:"tp_dependencia_adm_esc"`
	NomeMunicipio    string  `json:"no_municipio_prova"`
	SiglaUF          string  `json:"sg_uf_prova"`
	NotaCN           float64 `json:"nu_nota_cn"`
	NotaCH           float64 `json:"nu_nota_ch"`
	NotaLC           float64 `json:"nu_nota_lc"`
	NotaMT           float64 `json:"nu_nota_mt"`
	NotaRedacao      float64 `json:"nu_nota_redacao"`
	Ano              string  `json:"ano"`
	Media            float64 `json:"media"`
}

type MediaEnemAgrupadaMunicipio struct {
	Nome       string  `json:"nome"`
	MediaGeral float64 `json:"media_geral"`
	MediaCN    float64 `json:"media_cn"`
	MediaCH    float64 `json:"media_ch"`
	MediaLC    float64 `json:"media_lc"`
	MediaMT    float64 `json:"media_mt"`
	MediaRed   float64 `json:"media_red"`
	Ano        string  `json:"ano"`
}

type Municipio struct {
	ID                   uint    `json:"id" gorm:"primaryKey;autoIncrement"`
	Nome                 string  `json:"nome" gorm:"column:nome"`
	AreaTerritorial      float64 `json:"area_territorial"`
	Populacao            int64   `json:"populacao"`
	DensidadeDemografica float64 `json:"densidade_demografica"`
	Idhm                 float64 `json:"idhm"`
	ReceitasBrutas       float64 `json:"receitas_brutas"`
	DespesasBrutas       float64 `json:"despesas_brutas"`
	PibPerCapita         float64 `json:"pib_per_capita"`
}

func (NotaEnem) TableName() string {
	return "notas_enem"
}

func (MediaEnemAgrupadaMunicipio) TableName() string {
	return "view_media_enem_agrupada_municipio"
}
