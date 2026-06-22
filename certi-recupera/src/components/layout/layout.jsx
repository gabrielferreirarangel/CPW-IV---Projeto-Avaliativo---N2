import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Settings, Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useToast } from '../common/Toast';

/**
Princípio SOLID: Responsabilidade Única (SRP) - Centraliza a estrutura de navegação
e o monitoramento do status de conexão à rede.
*/

// layout principal da aplicacao
export function Layout({ children, activeTab, setActiveTab }) {
    
    // status da conexao e sistema de toast

    const isOnline = useOnlineStatus();
    const { addToast } = useToast();
    const [showNetworkToast, setShowNetworkToast] = useState(false);

    // monitora mudancas na rede

    useEffect(() => {
        const handleNetworkChange = () => {
            setShowNetworkToast(true);

            if (navigator.onLine) {
                addToast('Conexão Restaurada', 'O sistema está online e operando normalmente.', 'success');
            } else {
                addToast('Conexão Perdida', 'O sistema está offline. Os dados serão lidos e salvos localmente.', 'warning');
            }

            const timer = setTimeout(() => setShowNetworkToast(false), 3000);
            return () => clearTimeout(timer);
        };

        // add listeners de online e offline

        window.addEventListener('online', handleNetworkChange);
        window.addEventListener('offline', handleNetworkChange);

        return () => {

            // rmv listeners ao desmontar

            window.removeEventListener('online', handleNetworkChange);
            window.removeEventListener('offline', handleNetworkChange);
        };
    }, [addToast]);

    // abas usadas no menu

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'clientes', label: 'Gestão de Clientes', icon: Users },
        { id: 'configuracoes', label: 'Configurações', icon: Settings },
    ];

    return (
        <div className="app-container">

            {/* aviso rapido quando estiver offline */}

            {!isOnline && (
                <div className="network-status-alert offline" role="alert">
                    <WifiOff size={16} />
                    <span>Modo Offline - Acesso local ativado</span>
                </div>
            )}

            {/* menu lateral desktop */}

            <aside className="sidebar-container" aria-label="Navegação Lateral">
                <div className="sidebar-header">
                    <img src="/logo.svg" alt="CertiRecupera Logo" className="sidebar-logo" />
                    <h1 className="sidebar-title">CertiRecupera</h1>
                </div>

                <nav className="sidebar-nav" aria-label="Menu Principal">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`sidebar-link ${isActive ? 'active' : ''}`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* status atual da conexao */}

                <div className="sidebar-footer">
                    <div className={`connection-badge ${isOnline ? 'online' : 'offline'}`}>
                        {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                        <span>{isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                </div>
            </aside>

            {/* topo mobile */}

            <header className="mobile-header">
                <div className="mobile-header-left">
                    <img src="/logo.svg" alt="Logo" className="mobile-logo" />
                    <span className="mobile-app-title">CertiRecupera</span>
                </div>
            </header>

            {/* conteudo das paginas */}

            <main className="main-content">
                {children}
            </main>

            {/* navegacao inferior mobile */}

            <nav className="mobile-nav" aria-label="Navegação Móvel">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}

export default Layout;