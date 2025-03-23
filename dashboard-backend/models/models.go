package models

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

type IdebEscolas struct {
	ID            uint    `json:"id"`
	IBGEID        int     `json:"ibge_id"`
	DependenciaID int     `json:"dependencia_id"`
	CicloID       string  `json:"ciclo_id"`
	Ano           int     `json:"ano"`
	Ideb          float64 `json:"ideb"`
	Fluxo         float64 `json:"fluxo"`
	Aprendizado   float64 `json:"aprendizado"`
	NotaMT        float64 `json:"nota_mt"`
	NotaLP        float64 `json:"nota_lp"`
	NomeMunicipio string  `json:"nome_municipio"`
	Dependencia   string  `json:"dependencia"`
}

type Despesa struct {
	NomeMunicipio   string  `json:"nome_municipio"`
	CodigoMunicipio string  `json:"codigo_municipio"`
	Estagio         string  `json:"estagio"`
	Ano             string  `json:"ano"`
	DespesaTotal    float64 `json:"despesa_total"`
}

func (Municipio) TableName() string {
	return "view_municipios"
}

func (Despesa) TableName() string {
	return "view_despesas_municipais_educacao"
}

func (NotaEnem) TableName() string {
	return "notas_enem"
}

func (MediaEnemAgrupadaMunicipio) TableName() string {
	return "view_media_enem_agrupada_municipio"
}

func (IdebEscolas) TableName() string {
	return "view_indicadores_educacionais"
}
