# Dashboard Educacional - Paraíba

Este projeto é um dashboard interativo desenvolvido em React com Vite, TypeScript e TailwindCSS para visualização de dados educacionais do estado da Paraíba e seus municípios. Ele utiliza ApexCharts para a geração de gráficos e Leaflet para mapas.

## Visão Geral

O dashboard oferece duas visualizações principais:

1. **Visão Geral (PB):** Apresenta dados consolidados para o estado da Paraíba, incluindo evolução do IDEB, investimento em educação, médias do ENEM, e rankings municipais. Inclui um mapa interativo do IDEB por município.  
2. **Por Município:** Permite ao usuário selecionar um município e um ano específicos para visualizar dados detalhados, como informações gerais do município, indicadores educacionais (IDEB, SAEB), médias do ENEM por área, comparação com a média estadual, e a relação entre investimento e desempenho no ENEM.

## Funcionalidades

* Visualização de dados através de cards informativos e gráficos interativos (Barras, Linhas, Radar, Pizza, Dispersão).  
* Mapa interativo da Paraíba com coloração baseada no IDEB municipal.  
* Filtros por Município e Ano.  
* Seção de FAQ (Perguntas Frequentes) para explicar métricas e fontes de dados.  
* Design responsivo utilizando TailwindCSS.  
* Indicador de carregamento durante a busca de dados.  

## Estrutura do Projeto (FrontEnd)

O projeto foi refatorado para seguir uma estrutura baseada em features, visando melhor organização e manutenibilidade:

```text
/src
├── assets/             # Imagens estáticas e dados (como GeoJSON)
├── components/
│   └── ui/             # Componentes de UI genéricos e reutilizáveis
├── features/           # Módulos principais da aplicação
│   ├── dashboard/      # Controle geral do dashboard (header, troca de view)
│   ├── municipios/     # Funcionalidades da visão por município
│   └── paraiba/        # Funcionalidades da visão estadual
├── hooks/              # Hooks customizados compartilhados
├── services/           # Funções de chamada à API
├── styles/             # Arquivos CSS (principalmente fontes)
├── types/              # Definições de tipos TypeScript compartilhadas
├── utils/              # Funções utilitárias
└── main.tsx            # Ponto de entrada da aplicação

