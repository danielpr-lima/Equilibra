# 💜 Equilibra - Diário de Decisões Financeiras

O **Equilibra** é uma plataforma focada em **saúde financeira comportamental**. Ao contrário de aplicações tradicionais, o seu objetivo é promover o autoconhecimento e a reflexão sobre os gatilhos emocionais que levam ao consumo impulsivo.

## 📌 Sobre o Projeto
O projeto combate o analfabetismo financeiro comportamental, que gera ciclos de endividamento e ansiedade. Através de um diário, o utilizador regista o valor, o motivo e o sentimento por trás de cada decisão financeira.

### 🎯 Objetivos de Desenvolvimento Sustentável (ODS)
* **ODS 3 - Saúde e Bem-Estar:** Melhora a saúde mental ao reduzir o stresse financeiro.
* **ODS 4 - Educação de Qualidade:** Promove a consciência sobre hábitos de consumo.

## ✨ Funcionalidades Principais
* **Registo Diário:** Anotação de gastos e sentimentos relacionados.
* **Reflexão Financeira:** Compreensão de padrões e comportamentos ao longo do tempo.
* **Organização Prática:** Registo centralizado de informações financeiras.
* **Planeamento de Metas:** Definição de objetivos e acompanhamento de progresso.
* **Insights Visuais:** Gráficos interativos para visualização clara de despesas e estados de humor.

## 🛠️ Tecnologias Utilizadas
O projeto utiliza um conjunto moderno de tecnologias web para garantir interatividade e responsividade:

* **HTML5 & CSS3:** Estruturação semântica, layout e design responsivo.
* **JavaScript (ES6 Modules):** Lógica de programação modular, facilitando a escalabilidade e manutenção.
* **Web Storage API (LocalStorage):** Persistência de dados diretamente no navegador, sem necessidade de base de dados externa.
* **Chart.js:** Renderização de gráficos dinâmicos de pizza e de barras.
* **GSAP (GreenSock Animation Platform):** Biblioteca utilizada para criar animações fluidas na interface.
* **Google Fonts:** Tipografia 'Poppins' para um design moderno.

## 📂 Organização de Diretórios

A estrutura de pastas do projeto está organizada de forma modular para facilitar a manutenção:

```text
equilibra/
├── index.html                # Landing Page principal (apresentação)
├── README.md                 # Documentação principal do projeto
├── css/                      # Ficheiros de estilização modular
│   ├── global.css            # Variáveis e estilos globais
│   └── pages/                # Estilos específicos para cada ecrã
├── js/                       # Scripts e lógica da aplicação
│   ├── app.js                # Ficheiro principal orquestrador (inicializa módulos)
│   ├── theme.js              # Gerenciador de tema (Dark/Light mode)
│   ├── animacao.js           # Configuração de animações (GSAP)
│   └── modules/              # Lógica modular separada por domínio
│       ├── state.js          # Gestão do LocalStorage e estado global
│       ├── utils.js          # Funções utilitárias (formatBRL, formatDate, toast)
│       ├── ui.js             # Lógica de interface (menus, modais)
│       ├── gastos.js         # Lógica exclusiva da gestão de gastos
│       ├── metas.js          # Lógica exclusiva das metas
│       ├── planejamento.js   # Lógica de orçamento e semanas
│       ├── grafico.js        # Configuração do Chart.js
│       ├── emocional.js      # Lógica do diário emocional
│       └── padroes.js        # Lógica de insights e comportamentos
├── pages/                    # Páginas internas da aplicação
│   ├── home.html             # Dashboard principal do utilizador
│   ├── gastos.html           # Ecrã de despesas
│   ├── metas.html            # Ecrã de objetivos
│   └── ...                   # (Restantes páginas internas)
└── img/                      # Recursos visuais e identidade
    ├── bg/                   # Elementos gráficos de fundo (SVGs)
    ├── home/                 # Ilustrações e cards da página Home
    └── icons/                # Ícones e logomarca da plataforma