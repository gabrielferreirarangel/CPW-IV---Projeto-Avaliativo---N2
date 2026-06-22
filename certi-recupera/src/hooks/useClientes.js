import { useState, useEffect, useMemo } from 'react';
import { mockService } from '../services/mockService';
import { isActive, isExpired, isExpiringSoon } from '../utils/dateUtils';

/**
 Princípio SOLID: Responsabilidade Única (SRP) - Toda a regra de negócio
 e estado da aplicação são isolados neste Hook, deixando os componentes limpos.
 */

// hook principal q centraliza os dados e regras dos clientes

export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [template, setTemplate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifyingIds, setNotifyingIds] = useState({});

  // carrega os dados salvos quando o sistema inicia

  useEffect(() => {
    setClientes(mockService.getClientes());
    setTemplate(mockService.getTemplate());
  }, []);

  // gera os indicadores exibidos no dashboard

  const metrics = useMemo(() => {
    return {
      total: clientes.length,
      ativos: clientes.filter(c => isActive(c.dataVencimento)).length,
      vencidos: clientes.filter(c => isExpired(c.dataVencimento)).length,
      avisados: clientes.filter(c => c.statusNotificacao === 'avisado').length,
    };
  }, [clientes]);

  // lista apenas clientes com vencimento proximo

  const alertas = useMemo(() => {
    return clientes.filter(c => isExpiringSoon(c.dataVencimento));
  }, [clientes]);

  // aplica a busca pelos dados digitados

  const filteredClientes = useMemo(() => {
    if (!searchQuery.trim()) return clientes;

    const q = searchQuery.toLowerCase();

    return clientes.filter(c =>
      c.nome.toLowerCase().includes(q) ||
      c.documento.toLowerCase().includes(q) ||
      c.telefone.includes(q) ||
      c.tipoCertificado.toLowerCase().includes(q)
    );
  }, [clientes, searchQuery]);

  // simula o envio de aviso pelo whatsapp

  const enviarAviso = (id, callbackSuccess) => {
    if (notifyingIds[id]) return;

    // add estado de carregamento no cliente selecionado

    setNotifyingIds(prev => ({ ...prev, [id]: true }));

    setTimeout(() => {

      // atualiza o status para avisado

      const updated = mockService.updateClienteStatus(id, 'avisado');
      setClientes(updated);

      // rmv estado de carregamento

      setNotifyingIds(prev => ({ ...prev, [id]: false }));

      // executa alguma acao extra se existir

      if (callbackSuccess) {
        callbackSuccess(id);
      }
    }, 1500);
  };

  // salva alteracoes feitas no template

  const salvarTemplate = (newTemplate) => {
    const success = mockService.saveTemplate(newTemplate);

    if (success) {
      setTemplate(newTemplate);
    }

    return success;
  };

  // restaura os dados mockados originais

  const restaurarDadosOriginais = () => {
    const { clientes: resetC, template: resetT } = mockService.resetMockData();

    setClientes(resetC);
    setTemplate(resetT);
    setSearchQuery('');
  };

  return {
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
  };
}

export default useClientes;