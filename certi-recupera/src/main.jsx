import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ToastProvider } from './components/common/Toast';
import * as serviceWorker from './registerSW';

// imports principais da aplicacao

import './styles/global.scss';

// ativa o service worker para suporte offline

serviceWorker.register();

// ponto de entrada da aplicacao

createRoot(document.getElementById('root')).render(
  <StrictMode>

    {/* provider responsavel pelos toasts do sistema */}

    <ToastProvider>
      <App />
    </ToastProvider>

  </StrictMode>
);