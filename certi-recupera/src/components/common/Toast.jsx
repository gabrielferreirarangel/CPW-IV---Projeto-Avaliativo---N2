import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// contexto usado para compartilhar os toasts na aplicacao toda

const ToastContext = createContext(null);

export function ToastProvider({ children }) {

  // guarda todos os toasts ativos

  const [toasts, setToasts] = useState([]);

  // adiciona uma nova notificacao

  const addToast = useCallback((title, message, type = 'success', duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);

    // adiciona o toast na lista

    setToasts((prev) => [...prev, { id, title, message, type }]);
    
    // remove sozinho depois do tempo definido

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  // remove um toast pelo id

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>

      {/* renderiza o resto da aplicacao */}

      {children}

      {/* area responsavel por mostrar os toasts */}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {

  // pega os dados do contexto

  const context = useContext(ToastContext);

  // evita usar o hook fora do provider

  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }

  return context;
}

// componente que exibe os toasts na tela

function ToastContainer({ toasts, onRemove }) {

  // nao renderiza nada se nao existir toast

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="live" aria-live="assertive">

      {/* percorre todos os toasts cadastrados */}

      {toasts.map((toast) => {

        // escolhe o icone baseado no tipo

        const Icon = getToastIcon(toast.type);

        return (
          <div key={toast.id} className={`toast toast-${toast.type}`} role="alert">
            <div className={`toast-icon ${toast.type}`}>
              <Icon />
            </div>

            <div className="toast-content">

              {/* titulo opcional */}

              {toast.title && <h4 className="toast-title">{toast.title}</h4>}

              {/* mensagem principal */}

              <p className="toast-message">{toast.message}</p>
            </div>

            <button 
              className="toast-close" 
              onClick={() => onRemove(toast.id)}
              aria-label="Fechar notificação"
            >

              {/* botao de fechar */}

              <X />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// escolhe qual icone usar em cada tipo de toast

function getToastIcon(type) {
  switch (type) {
    case 'success':
      return CheckCircle;

    case 'error':
      return AlertCircle;

    case 'warning':
      return AlertTriangle;

    case 'info':
    default:
      return Info;
  }
}

export default ToastProvider;