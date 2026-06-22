import React, { useState, useMemo } from 'react';
import { Search, Send, UserX, MessageSquare, AlertCircle, RefreshCw, Eye } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useToast } from '../components/common/Toast';
import { formatDate, isExpired } from '../utils/dateUtils';

// tela de gerenciamento dos clientes

export function Clientes({
  clientes,
  filteredClientes,
  searchQuery,
  setSearchQuery,
  notifyingIds,
  enviarAviso,
  restaurarDadosOriginais
}) {
  const { addToast } = useToast();

  // filtro rapido por status

  const [statusFilter, setStatusFilter] = useState('todos');

  // aplica filtros extras alem da busca

  const finalFilteredClientes = useMemo(() => {
    return filteredClientes.filter(c => {
      if (statusFilter === 'todos') return true;
      if (statusFilter === 'ativos') return !isExpired(c.dataVencimento);
      if (statusFilter === 'vencidos') return isExpired(c.dataVencimento);
      if (statusFilter === 'pendentes') return c.statusNotificacao === 'pendente';
      if (statusFilter === 'avisados') return c.statusNotificacao === 'avisado';

      return true;
    });
  }, [filteredClientes, statusFilter]);

  // envia aviso e atualiza status

  const handleSendAviso = (cliente) => {
    enviarAviso(cliente.id, () => {
      addToast(
        'Aviso Enviado com Sucesso!',
        `Status de ${cliente.nome} atualizado para 'Avisado'.`,
        'success'
      );
    });
  };

  // restaura os dados mockados

  const handleReset = () => {
    restaurarDadosOriginais();
    setStatusFilter('todos');

    addToast(
      'Dados Restaurados',
      'A base de dados local foi reiniciada para os valores mockados padrão.',
      'info'
    );
  };

  // filtros exibidos acima da tabela

  const statusPills = [
    { id: 'todos', label: 'Todos' },
    { id: 'ativos', label: 'Ativos' },
    { id: 'vencidos', label: 'Vencidos' },
    { id: 'pendentes', label: 'Pendentes' },
    { id: 'avisados', label: 'Avisados' }
  ];

  return (
    <div className="animate-fade">

      {/* topo da pagina */}

      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
            Gestão de Clientes
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Consulte a listagem, filtre prazos e simule o envio de notificações de renovação.
          </p>
        </div>

        <Button
          variant="secondary"
          icon={RefreshCw}
          onClick={handleReset}
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          Resetar Dados
        </Button>
      </header>

      {/* busca e filtros */}

      <Card style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* campo de busca */}

          <div style={{ width: '100%' }}>
            <Input
              id="search-input"
              type="text"
              icon={Search}
              placeholder="Buscar cliente por nome, documento ou tipo de certificado (A1/A3)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar clientes"
            />
          </div>

          {/* filtros rapidos */}

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} role="tablist" aria-label="Filtrar por Status">
            {statusPills.map(pill => (
              <button
                key={pill.id}
                role="tab"
                aria-selected={statusFilter === pill.id}
                onClick={() => setStatusFilter(pill.id)}
                style={{
                  padding: '0.4rem 1rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  borderRadius: '9999px',
                  backgroundColor: statusFilter === pill.id ? 'var(--color-primary)' : 'var(--bg-tertiary)',
                  color: statusFilter === pill.id ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: statusFilter === pill.id ? 'var(--color-primary)' : 'var(--border-color)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {finalFilteredClientes.length === 0 ? (

        // exibido quando nao encontra resultado

        <Card className="empty-state">
          <div className="empty-icon">
            <UserX size={48} />
          </div>

          <h3>Nenhum cliente encontrado</h3>

          <p>
            {clientes.length === 0
              ? 'Não há clientes cadastrados no sistema. Clique em "Resetar Dados" para restaurar a lista padrão.'
              : 'Nenhum cliente atende aos filtros de busca aplicados. Tente ajustar o texto ou os botões de filtro.'}
          </p>

          {clientes.length === 0 && (
            <Button variant="primary" onClick={handleReset}>
              Restaurar Base Padrão
            </Button>
          )}
        </Card>
      ) : (

        // tabela principal de clientes

        <div className="table-container" style={{ animation: 'fadeIn 0.5s ease both' }}>
          <table className="table" aria-label="Tabela de Clientes">
            <thead>
              <tr>
                <th>Cliente / Documento</th>
                <th>Contato</th>
                <th>Certificado</th>
                <th>Data de Vencimento</th>
                <th>Status Vencimento</th>
                <th>Notificação</th>
                <th style={{ textAlign: 'right' }}>Ação</th>
              </tr>
            </thead>

            <tbody>
              {finalFilteredClientes.map((cliente) => {
                const expired = isExpired(cliente.dataVencimento);
                const notifying = notifyingIds[cliente.id];

                return (
                  <tr key={cliente.id}>

                    {/* dados do cliente */}

                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cliente.nome}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{cliente.documento}</div>
                    </td>

                    {/* contato whatsapp */}

                    <td style={{ fontSize: '0.875rem' }}>
                      <a
                        href={`https://wa.me/${cliente.telefone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: 'var(--color-secondary)',
                          fontWeight: 500
                        }}
                        title="Ver contato no WhatsApp"
                      >
                        <MessageSquare size={14} />
                        +{cliente.telefone}
                      </a>
                    </td>

                    <td>
                      <span className="badge badge-ativo" style={{ fontSize: '0.7rem' }}>
                        {cliente.tipoCertificado}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.875rem' }}>
                      {formatDate(cliente.dataVencimento)}
                    </td>

                    {/* status do certificado */}

                    <td>
                      <span className={`badge ${expired ? 'badge-vencido' : 'badge-ativo'}`} style={{ fontSize: '0.7rem' }}>
                        {expired ? 'Vencido' : 'Ativo'}
                      </span>
                    </td>

                    {/* status do aviso */}

                    <td>
                      <span className={`badge badge-${cliente.statusNotificacao}`} style={{ fontSize: '0.7rem' }}>
                        {cliente.statusNotificacao === 'avisado' ? 'Avisado' : 'Pendente'}
                      </span>
                    </td>

                    {/* btn de envio */}

                    <td style={{ textAlign: 'right' }}>
                      <Button
                        variant={cliente.statusNotificacao === 'avisado' ? 'outline' : 'success'}
                        size="sm"
                        isLoading={notifying}
                        disabled={notifying}
                        onClick={() => handleSendAviso(cliente)}
                        icon={Send}
                        style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                      >
                        {cliente.statusNotificacao === 'avisado' ? 'Reenviar' : 'Enviar Aviso'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Clientes;