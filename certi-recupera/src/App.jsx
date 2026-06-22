import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Clientes } from './pages/Clientes';
import { Configuracoes } from './pages/Configuracoes';
import { useClientes } from './hooks/useClientes';

export function App() {

  // controla qual tela esta aberta

  const [activeTab, setActiveTab] = useState('dashboard');
  
  // hook principal com regras e estados da aplicacao

  const {
    clientes,
    template,
    searchQuery,
    setSearchQuery,
    notifyingIds,
    metrics,
    alertas,
    filteredClientes,
    enviarAviso,
    salvarTemplate,
    restaurarDadosOriginais
  } = useClientes();

  // troca as paginas conforme a aba selecionada

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            metrics={metrics}
            alertas={alertas}
            notifyingIds={notifyingIds}
            enviarAviso={enviarAviso}
            setActiveTab={setActiveTab}
          />
        );

      case 'clientes':
        return (
          <Clientes
            clientes={clientes}
            filteredClientes={filteredClientes}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            notifyingIds={notifyingIds}
            enviarAviso={enviarAviso}
            restaurarDadosOriginais={restaurarDadosOriginais}
          />
        );

      case 'configuracoes':
        return (
          <Configuracoes
            template={template}
            salvarTemplate={salvarTemplate}
            restaurarDadosOriginais={restaurarDadosOriginais}
          />
        );

      // fallback caso aconteca algo inesperado

      default:
        return (
          <Dashboard
            metrics={metrics}
            alertas={alertas}
            notifyingIds={notifyingIds}
            enviarAviso={enviarAviso}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (

    // estrutura principal da aplicacao

    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderPage()}
    </Layout>
  );
}

export default App;