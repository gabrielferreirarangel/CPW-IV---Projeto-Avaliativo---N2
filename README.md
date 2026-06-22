```markdown
# Projeto Avaliativo N2 - Construção de Páginas Web IV

## 5.1 Identificação
**Nome do projeto:** CertiRecupera  
**Descrição:** Feito excluisivamente para N2 de CPW IV porem como real possivel reformulação do frontend de CertiRecupera em PWA. Permite simular avisos via WhatsApp e funciona 100% offline utilizando LocalStorage e Service Workers.

---

## 5.2 Funcionalidades
* **Dashboard:** Status e alertas de certificados que vencem nos próximos 7 dias.
* **Gestão de Clientes:** Listagem com busca global (nome, documento, telefone) e filtros rápidos de status.
* **Notificações:** Simulação de envio de mensagens via WhatsApp com atualização de banco de dados.
* **Configurações:** Editor do template de mensagem com variáveis dinâmicas (`[Nome]`, `[Data]`) e preview visual.
* **PWA / Offline:** Funcionamento sem internet com feedback visual (Toasts) sobre o status da conexão.

---

## 5.3 Instruções de execução
1. Certifique-se de ter o **Node.js** instalado.
2. No terminal da pasta raiz, instale as dependências:
```bash
   npm install

```

3. Rode o servidor local:

```bash
   npm run dev

```

4. Para testar o cache offline (produção):

```bash
   npm run build
   npm run preview

```

---

## 5.5 Estrutura do projeto

Arquitetura.

```text
certirecupera/
├── public/                 # Assets públicos e PWA (manifest, sw.js)
├── src/                    
│   ├── assets/             # Imagens e vetores
│   ├── components/         # Componentes isolados (UI e Layout)
│   ├── hooks/              # Regras de negócio separadas (SRP)
│   ├── pages/              # Telas principais (Apresentadores)
│   ├── services/           # Comunicação com LocalStorage (Singleton)
│   ├── styles/             # Modularização SCSS (variáveis, mixins)
│   ├── utils/              # Funções auxiliares (datas)
│   ├── App.jsx             # Roteador de abas
│   └── main.jsx            # Ponto de entrada
├── index.html              # HTML raiz
├── package.json            # Dependências
└── vite.config.js          # Configuração do Vite

```

---

## 5.6 Fluxo da aplicação

1. **Início:** O app carrega os dados do LocalStorage (ou mock de testes) e registra o Service Worker.
2. **Visão Geral:** O Dashboard compila os prazos e exibe os alertas urgentes.
3. **Ação:** Na gestão, o usuário simula o disparo de avisos, atualizando o status do cliente.
4. **Edição:** Alterações no template de texto refletem imediatamente no sistema.
5. **Offline:** Em caso de queda de rede, o Service Worker serve as telas em cache e as ações continuam sendo salvas no LocalStorage.

---

## 5.7 Considerações finais

**Dificuldades encontradas:**

* Conflitos entre o cache do Service Worker e o Hot Reload (HMR) do Vite no desenvolvimento.
* Isolamento de responsabilidades (S.O.L.I.D.) no React..
* Fixar uma data base estática para garantir o funcionamento dos alertas de testes em qualquer dia.

**Possíveis melhorias:**

* Integração nativa com a minha API REST(WhatsApp Web Js) ou equivalente.
* Importação de planilhas CSV.
* Implementação de um CRUD completo para gerenciar (adicionar/editar) os clientes.

```

```
