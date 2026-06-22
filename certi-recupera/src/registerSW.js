// registra o service worker quando estiver em producao

export function register() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {

    // espera a pagina carregar antes de registrar

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado com sucesso:', registration.scope);
        })
        .catch((error) => {
          console.error('Falha ao registrar o Service Worker:', error);
        });
    });

  } else if ('serviceWorker' in navigator && import.meta.env.DEV) {

    // em dev normalmente fica desativado pra nao dar dor de cabeca com cache

    console.log('Service Worker disponível (pulado em modo de desenvolvimento)');
  }
}

// rmv o service worker registrado

export function unregister() {
  if ('serviceWorker' in navigator) {

    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });

  }
}