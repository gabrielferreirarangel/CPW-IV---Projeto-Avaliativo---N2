import React, { useState, useEffect } from 'react';
import { Save, Clipboard, RefreshCw, MessageSquare, Info, ShieldCheck } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useToast } from '../components/common/Toast';

// tela de configuracoes do sistema

export function Configuracoes({
  template,
  salvarTemplate,
  restaurarDadosOriginais
}) {
  const { addToast } = useToast();

  const [localTemplate, setLocalTemplate] = useState(template);
  const [isSaving, setIsSaving] = useState(false);

  // mantem o template sincronizado

  useEffect(() => {
    setLocalTemplate(template);
  }, [template]);

  // salva alteracoes do template

  const handleSave = (e) => {
    e.preventDefault();

    if (!localTemplate.trim()) {
      addToast('Erro ao Salvar', 'O template de mensagem não pode estar vazio.', 'error');
      return;
    }

    setIsSaving(true);

    // simula tempo de salvamento

    setTimeout(() => {
      const success = salvarTemplate(localTemplate);

      setIsSaving(false);

      if (success) {
        addToast(
          'Configurações Salvas',
          'O template de aviso do WhatsApp foi gravado com sucesso no LocalStorage.',
          'success'
        );
      } else {
        addToast('Falha no Armazenamento', 'Não foi possível gravar no LocalStorage.', 'error');
      }
    }, 800);
  };

  // add tag no final da msg

  const handleInsertTag = (tag) => {
    setLocalTemplate(prev => prev + tag);

    addToast(
      'Tag Inserida',
      `Tag ${tag} adicionada ao final do texto.`,
      'info'
    );
  };

  // gera uma previa da msg com dados ficticios

  const previewMessage = () => {
    if (!localTemplate) return '';

    return localTemplate
      .replace(/\[Nome\]/g, 'João Silva')
      .replace(/\[Tipo\]/g, 'A3')
      .replace(/\[Data\]/g, '22/06/2026');
  };

  // converte *texto* para negrito na visualizacao

  const formatPreviewHtml = (text) => {
    if (!text) return '';

    const boldRegex = /\*(.*?)\*/g;

    return text.replace(boldRegex, '<strong>$1</strong>');
  };

  // tags disponiveis para usar no template

  const tags = [
    { code: '[Nome]', desc: 'Nome completo do cliente' },
    { code: '[Tipo]', desc: 'Tipo do certificado (A1 / A3)' },
    { code: '[Data]', desc: 'Data de vencimento formatada' },
  ];

  return (
    <div className="animate-fade">

      {/* topo da pagina */}

      <header className="page-header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
          Configurações do Sistema
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
          Personalize as mensagens automáticas e ajuste as preferências de recuperação.
        </p>
      </header>

      {/* editor e preview lado a lado */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}
      >

        {/* editor do template */}

        <section aria-labelledby="editor-title">
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card>
              <h3 id="editor-title" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>
                Template de Notificação (WhatsApp)
              </h3>

              <Input
                id="template-editor"
                type="textarea"
                rows={6}
                label="Corpo da Mensagem"
                placeholder="Insira a mensagem do WhatsApp..."
                value={localTemplate}
                onChange={(e) => setLocalTemplate(e.target.value)}
                aria-describedby="template-instructions"
              />

              {/* dica sobre negrito */}

              <div id="template-instructions" style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.375rem' }}>
                <Info size={16} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '0.125rem' }} />
                <span>Use asteriscos <code>*texto*</code> para deixar trechos em negrito no WhatsApp.</span>
              </div>
            </Card>

            {/* lista de tags dinamicas */}

            <Card>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', fontFamily: 'Outfit, sans-serif' }}>
                Tags Variáveis Dinâmicas
              </h3>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Clique em uma tag para inseri-la no final do seu modelo de mensagem:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {tags.map((tag) => (
                  <button
                    key={tag.code}
                    type="button"
                    onClick={() => handleInsertTag(tag.code)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.625rem 0.875rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-tertiary)',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    title={`Inserir ${tag.code}`}
                  >
                    <code style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                      {tag.code}
                    </code>

                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {tag.desc}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* btn para salvar */}

            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              icon={Save}
              style={{ width: '100%', padding: '0.75rem 1.5rem' }}
            >
              Salvar Alterações
            </Button>
          </form>
        </section>

        {/* simulacao da msg no whatsapp */}

        <section aria-label="Visualização em tempo real">
          <Card
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.5rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)'
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem', fontFamily: 'Outfit, sans-serif' }}>
              Simulador de Visualização
            </h3>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Veja como o cliente receberá a mensagem no celular (exemplo simulado).
            </p>

            {/* estrutura visual do celular */}

            <div
              className="phone-mockup"
              style={{
                flex: 1,
                border: '8px solid var(--text-primary)',
                borderRadius: '30px',
                backgroundColor: '#efeae2',
                backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                backgroundSize: 'contain',
                minHeight: '340px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'var(--card-shadow)'
              }}
            >

              {/* cabecalho fake do whatsapp */}

              <div
                style={{
                  backgroundColor: '#075e54',
                  color: '#ffffff',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
                }}
              >
                ...
              </div>

              {/* area da conversa */}

              <div
                style={{
                  flex: 1,
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start'
                }}
              >

                {/* bolha da mensagem */}

                <div
                  className="whatsapp-bubble"
                  style={{
                    backgroundColor: '#d9fdd3',
                    color: '#111b21',
                    padding: '0.5rem 0.75rem 0.75rem 0.75rem',
                    borderRadius: '0 8px 8px 8px',
                    maxWidth: '85%',
                    alignSelf: 'flex-start',
                    boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
                    position: 'relative',
                    fontSize: '0.85rem',
                    lineHeight: '1.4',
                    marginTop: '0.5rem',
                    wordBreak: 'break-word'
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatPreviewHtml(previewMessage())
                    }}
                  />

                  {/* horario fake da msg */}

                  <div
                    style={{
                      textAlign: 'right',
                      fontSize: '0.625rem',
                      color: '#667781',
                      marginTop: '0.25rem'
                    }}
                  >
                    10:30
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

export default Configuracoes;