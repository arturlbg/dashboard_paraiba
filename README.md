# Dashboard Educacional - Paraíba

Este projeto é um dashboard interativo desenvolvido em React com Vite, TypeScript e TailwindCSS para visualização de dados educacionais do estado da Paraíba e seus municípios. Ele utiliza ApexCharts para a geração de gráficos e Leaflet para mapas.

## Visão Geral

O dashboard oferece duas visualizações principais:

1. **Visão Geral (PB):** Apresenta dados consolidados para o estado da Paraíba, incluindo evolução do IDEB, investimento em educação, médias do ENEM, e rankings municipais. Inclui um mapa interativo do IDEB por município.  
2. **Por Município:** Permite ao usuário selecionar um município e um ano específicos para visualizar dados detalhados, como informações gerais do município, indicadores educacionais (IDEB, SAEB), médias do ENEM por área, comparação com a média estadual, e a relação entre investimento e desempenho no ENEM.

<img width="1907" height="443" alt="TelaInicial" src="https://github.com/user-attachments/assets/7970a95c-7981-4097-9c26-01e3f36a0c50" />

<img width="1896" height="861" alt="TelaMunicipios" src="https://github.com/user-attachments/assets/9c1f0bd6-1ad0-4d68-925b-13e2f7a8b0b6" />

<img width="1885" height="826" alt="IdebParaiba" src="https://github.com/user-attachments/assets/361264e9-bf8e-4fdd-ac90-e4a797c9e36a" />

<img width="1882" height="832" alt="TopInvestimento" src="https://github.com/user-attachments/assets/6940c0f0-a61f-4465-8c83-6b5767baffef" />



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

