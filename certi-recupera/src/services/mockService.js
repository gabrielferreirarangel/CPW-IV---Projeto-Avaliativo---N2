// chaves usadas no localStorage

const CLIENTS_STORAGE_KEY = 'certirecupera_clientes';
const TEMPLATE_STORAGE_KEY = 'certirecupera_whatsapp_template';

// msg padrao enviada no whatsapp

const DEFAULT_TEMPLATE = 'Olá *[Nome]*, seu certificado digital do tipo *[Tipo]* vence em *[Data]*. Entre em contato conosco para garantir a renovação rápida e sem burocracia!';

// base inicial usada para testes

const INITIAL_CLIENTES = [
  {
    id: "1",
    nome: "Empresa Alpha Ltda",
    documento: "12.345.678/0001-90",
    telefone: "5511999999999",
    tipoCertificado: "A1",
    dataVencimento: "2026-06-25",
    statusNotificacao: "pendente"
  },
  {
    id: "2",
    nome: "João Silva",
    documento: "123.456.789-00",
    telefone: "5511888888888",
    tipoCertificado: "A3",
    dataVencimento: "2026-06-22",
    statusNotificacao: "avisado"
  },
  {
    id: "3",
    nome: "Manoel Gomes da Silva",
    documento: "987.654.321-11",
    telefone: "5521977777777",
    tipoCertificado: "A1",
    dataVencimento: "2026-06-20", 
    statusNotificacao: "pendente"
  },
  {
    id: "4",
    nome: "Beta Consultoria Eireli",
    documento: "98.765.432/0001-09",
    telefone: "5511966665555",
    tipoCertificado: "A3",
    dataVencimento: "2026-06-21",
    statusNotificacao: "pendente"
  },
  {
    id: "5",
    nome: "Carla Souza Oliveira",
    documento: "456.789.123-44",
    telefone: "5531988887777",
    tipoCertificado: "A1",
    dataVencimento: "2026-06-27",
    statusNotificacao: "pendente"
  },
  {
    id: "6",
    nome: "Tech Inovações S.A.",
    documento: "45.678.901/0001-23",
    telefone: "5511955554444",
    tipoCertificado: "A1",
    dataVencimento: "2026-07-05",
    statusNotificacao: "pendente"
  },
  {
    id: "7",
    nome: "Pedro Santos Cunha",
    documento: "321.654.987-22",
    telefone: "5581944443333",
    tipoCertificado: "A3",
    dataVencimento: "2026-06-15", 
    statusNotificacao: "avisado"
  },
  {
    id: "8",
    nome: "Padaria do Bairro Ltda",
    documento: "11.222.333/0001-44",
    telefone: "5511933332222",
    tipoCertificado: "A1",
    dataVencimento: "2026-06-24", 
    statusNotificacao: "pendente"
  },
  {
    id: "9",
    nome: "Dr. Marcos Roberto (Dentista)",
    documento: "159.753.852-99",
    telefone: "5519922221111",
    tipoCertificado: "A3",
    dataVencimento: "2026-06-18", 
    statusNotificacao: "pendente"
  },
  {
    id: "10",
    nome: "Supermercado Progresso",
    documento: "55.666.777/0001-88",
    telefone: "5547911110000",
    tipoCertificado: "A1",
    dataVencimento: "2026-07-21",
    statusNotificacao: "pendente"
  }
];

export const mockService = {

  // busca clientes salvos ou cria os iniciais

  getClientes: () => {
    try {
      const stored = localStorage.getItem(CLIENTS_STORAGE_KEY);

      if (!stored) {
        localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(INITIAL_CLIENTES));
        return INITIAL_CLIENTES;
      }

      return JSON.parse(stored);
    } catch (error) {
      console.error('Erro ao ler clientes do LocalStorage:', error);
      return INITIAL_CLIENTES;
    }
  },

  // salva lista atual de clientes

  saveClientes: (clientes) => {
    try {
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clientes));
      return true;
    } catch (error) {
      console.error('Erro ao salvar clientes no LocalStorage:', error);
      return false;
    }
  },

  // recupera template atual do whatsapp

  getTemplate: () => {
    try {
      const stored = localStorage.getItem(TEMPLATE_STORAGE_KEY);

      if (!stored) {
        localStorage.setItem(TEMPLATE_STORAGE_KEY, DEFAULT_TEMPLATE);
        return DEFAULT_TEMPLATE;
      }

      return stored;
    } catch (error) {
      console.error('Erro ao ler template do LocalStorage:', error);
      return DEFAULT_TEMPLATE;
    }
  },

  // salva alteracoes do template

  saveTemplate: (template) => {
    try {
      localStorage.setItem(TEMPLATE_STORAGE_KEY, template);
      return true;
    } catch (error) {
      console.error('Erro ao salvar template no LocalStorage:', error);
      return false;
    }
  },

  // atualiza status de notificacao de um cliente

  updateClienteStatus: (id, status) => {
    const clientes = mockService.getClientes();

    const updated = clientes.map(cliente => {
      if (cliente.id === id) {
        return { ...cliente, statusNotificacao: status };
      }

      return cliente;
    });

    mockService.saveClientes(updated);

    return updated;
  },

  // volta tudo pro estado inicial

  resetMockData: () => {
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(INITIAL_CLIENTES));
    localStorage.setItem(TEMPLATE_STORAGE_KEY, DEFAULT_TEMPLATE);

    return {
      clientes: INITIAL_CLIENTES,
      template: DEFAULT_TEMPLATE
    };
  }
};