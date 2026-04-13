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

## 🛠️ Tecnologias Utilizadas
O projeto utiliza um conjunto moderno de tecnologias web para garantir interatividade e responsividade:

* **HTML5:** Estruturação semântica do conteúdo.
* **CSS3:** Estilização, layout e design responsivo.
* **JavaScript (JS):** Lógica de programação e manipulação do DOM.
* **GSAP (GreenSock Animation Platform):** Biblioteca utilizada para criar animações fluidas na interface, como transições de logomarca e elementos flutuantes.
* **Google Fonts:** Utilização da fonte 'Poppins' para uma tipografia moderna.

## 📂 Organização de Diretórios

A estrutura de pastas do projeto está organizada de forma modular para facilitar a manutenção:

```text
equilibra/
├── index.html                # Landing Page principal (apresentação)
├── README.md                 # Documentação principal do projeto
├── css/                      # Ficheiros de estilização modular
│   ├── footer-style.css      # Estilos específicos do rodapé
│   ├── home.css              # Estilos da página Home (dashboard)
│   ├── parte1-style.css      # Estilos da secção inicial da Landing Page
│   ├── parte2-style.css      # Estilos da secção de descrição
│   └── parte3-style.css      # Estilos dos cards de benefícios
├── app.js               # Arquivo principal que inicializa tudo (o antigo DOMContentLoaded)
├── theme.js             # (Mantém como está, cuida do dark/light mode)
├── animacao.js          # (Mantém como está, cuida do GSAP)
└── modules/             # Nova pasta para organizar a lógica
    ├── state.js         # Gerenciamento do LocalStorage e estado global (Mocks, persistAll)
    ├── utils.js         # Funções ajudantes (formatBRL, formatDate, toast, uid)
    ├── ui.js            # Lógica geral de interface (menu hamburger, modais, nav highlight)
    ├── gastos.js        # Lógica exclusiva da tela de gastos
    ├── metas.js         # Lógica exclusiva da tela de metas
    ├── planejamento.js  # Lógica de orçamento e semanas
    ├── grafico.js       # Configuração do Chart.js
    ├── emocional.js     # Lógica do diário emocional
    └── padroes.js       # Lógica de insights e padrões comportamentais
├── pages/                    # Páginas internas da aplicação
│   └── home.html             # Página principal do utilizador (Dashboard)
└── img/                      # Recursos visuais e identidade
    ├── bg/                   # Elementos gráficos de fundo (SVGs)
    ├── home/                 # Ilustrações e cards da página Home
    └── icons/                # Ícones e logomarca da plataforma
    *© 2026 Equilibra - Projeto desenvolvido para fins académicos*.
    