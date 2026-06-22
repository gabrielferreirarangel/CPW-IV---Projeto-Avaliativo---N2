import { useState, useEffect } from 'react';

// hook responsavel por acompanhar o status da conexao

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {

    // atualiza para online

    const handleOnline = () => setIsOnline(true);

    // atualiza para offline

    const handleOffline = () => setIsOnline(false);

    // add listeners de conexao

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // rmv listeners ao desmontar o componente

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export default useOnlineStatus;