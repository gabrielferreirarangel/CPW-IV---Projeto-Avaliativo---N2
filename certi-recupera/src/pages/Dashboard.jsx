import React from 'react';
import { Users, ShieldCheck, ShieldAlert, CheckCircle, Bell, ArrowRight, Calendar, AlertTriangle } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import { formatDate, daysRemaining } from '../utils/dateUtils';

// tela inicial com resumo geral e alertas

export function Dashboard({
  metrics,
  alertas,
  notifyingIds,
  enviarAviso,
  setActiveTab
}) {
  const { addToast } = useToast();

  // dispara o aviso e mostra msg de sucesso

  const handleSendAviso = (cliente) => {
    enviarAviso(cliente.id, () => {
      addToast(
        'Aviso Enviado!',
        `Mensagem de WhatsApp simulada para ${cliente.nome} com sucesso.`,
        'success'
      );
    });
  };

  // deixa apenas quem ainda nao recebeu aviso

  const pendingAlerts = alertas.filter(c => c.statusNotificacao === 'pendente');

  return (
    <div className="animate-fade">

      {/* cabecalho da pagina */}

      <header className="page-header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
          Dashboard de Controle
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
          Visão geral da carteira de clientes e ações prioritárias de recuperação.
        </p>
      </header>

      {/* cards com indicadores principais */}

      <section
        className="metrics-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}
        aria-label="Indicadores de Desempenho"
      >
        <Card
          isMetric
          metricIcon={Users}
          metricValue={metrics.total}
          metricLabel="Total de Clientes"
          metricColor="primary"
          interactive
          onClick={() => setActiveTab('clientes')}
        />
        <Card
          isMetric
          metricIcon={ShieldCheck}
          metricValue={metrics.ativos}
          metricLabel="Certificados Ativos"
          metricColor="success"
        />
        <Card
          isMetric
          metricIcon={ShieldAlert}
          metricValue={metrics.vencidos}
          metricLabel="Certificados Vencidos"
          metricColor="danger"
        />
        <Card
          isMetric
          metricIcon={CheckCircle}
          metricValue={metrics.avisados}
          metricLabel="Avisos Enviados"
          metricColor="secondary"
        />
      </section>

      {/* clientes com vencimento proximo */}

      <section aria-labelledby="alerts-heading">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 id="alerts-heading" style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} style={{ color: 'var(--color-warning)' }} />
            Alertas de Vencimento (Próximos 7 Dias)
          </h3>

          <Button variant="outline" size="sm" onClick={() => setActiveTab('clientes')} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
            Ver Todos <ArrowRight size={14} style={{ marginLeft: '0.25rem' }} />
          </Button>
        </div>

        {pendingAlerts.length === 0 ? (

          // estado vazio quando nao existe alerta

          <Card className="empty-state">
            <div className="empty-icon">
              <CheckCircle size={48} style={{ color: 'var(--color-success)' }} />
            </div>
            <h3>Tudo em dia!</h3>
            <p>Não há clientes pendentes de aviso com vencimento nos próximos 7 dias.</p>
          </Card>
        ) : (

          // tabela com os clientes que precisam de contato

          <div className="table-container" style={{ animation: 'fadeIn 0.5s ease both' }}>
            <table className="table" aria-label="Clientes com vencimento próximo">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Data de Vencimento</th>
                  <th>Prazo</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {pendingAlerts.map((cliente) => {
                  const days = daysRemaining(cliente.dataVencimento);

                  let timeLabel = '';
                  let badgeClass = 'badge-pendente';

                  // define o nivel de urgencia

                  if (days === 0) {
                    timeLabel = 'Vence hoje!';
                    badgeClass = 'badge-vencido';
                  } else if (days === 1) {
                    timeLabel = 'Vence amanhã';
                  } else {
                    timeLabel = `Vence em ${days} dias`;
                  }

                  return (
                    <tr key={cliente.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{cliente.nome}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Doc: {cliente.documento}</div>
                      </td>

                      <td>
                        <span className="badge badge-ativo" style={{ fontSize: '0.7rem' }}>
                          {cliente.tipoCertificado}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem' }}>
                          <Calendar size={14} style={{ color: 'var(--text-tertiary)' }} />
                          {formatDate(cliente.dataVencimento)}
                        </div>
                      </td>

                      <td>
                        <span className={`badge ${badgeClass}`} style={{ fontSize: '0.7rem' }}>
                          {days === 0 && <AlertTriangle size={10} style={{ marginRight: '0.125rem' }} />}
                          {timeLabel}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>

                        {/* btn para enviar aviso */}

                        <Button
                          variant="success"
                          size="sm"
                          isLoading={notifyingIds[cliente.id]}
                          onClick={() => handleSendAviso(cliente)}
                          style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
                        >
                          Enviar WhatsApp
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;