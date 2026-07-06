import React, { useEffect, useState } from 'react';
import { AgentTool } from '@sdkwork/modelkit-types';
import { useService, useAppContext } from '@sdkwork/modelkit-core';
import { IAgentService, IAgentServiceToken } from '@sdkwork/modelkit-services';
import { WorkspaceView } from '../components/common/WorkspaceView';
import { Sidebar, SidebarTab } from '../components/common/Sidebar';
import { SystemSettings } from '../components/system/SystemSettings';
import { UserProfile } from '../components/user/UserProfile';
import { LocalRelayManager, LocalRelay } from '../components/relay/LocalRelayManager';
import { ApiKeyManager } from '../components/relay/ApiKeyManager';
import { RequestLogsView } from '../components/relay/RequestLogsView';
import { UsageView } from '../components/relay/UsageView';
import { VipPurchaseView } from '../components/vip/VipPurchaseView';
import { LocalGatewayCreateModal } from './modals/LocalGatewayCreateModal';
import { RelayAppConfigModal } from '../components/modals/RelayAppConfigModal';
import { toast } from 'sonner';
import { workspaceService } from '../services/WorkspaceService';
import { LocalApiKey } from '../services/types';

interface WorkspacePageProps {
  navigateTarget?: 'user-profile' | 'system-settings' | null;
  onClearNavigateTarget?: () => void;
}

export function WorkspacePage({ navigateTarget, onClearNavigateTarget }: WorkspacePageProps) {
  const { t } = useAppContext();
  const agentService = useService<IAgentService>(IAgentServiceToken);
  const [tools, setTools] = useState<AgentTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeToolId, setActiveToolId] = useState<string>('');
  
  const [activeTab, setActiveTab] = useState<SidebarTab>('tools');
  const [isVip, setIsVip] = useState(false);
  
  useEffect(() => {
    workspaceService.getVipStatus().then(status => setIsVip(status.isActive));
  }, []);
  
  useEffect(() => {
    if (navigateTarget) {
      setActiveTab('settings');
      setActiveToolId(navigateTarget);
      onClearNavigateTarget?.();
    }
  }, [navigateTarget, onClearNavigateTarget]);
  const [activeRelayId, setActiveRelayId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAppConfigModalOpen, setIsAppConfigModalOpen] = useState(false);
  const [activeAppConfigRelay, setActiveAppConfigRelay] = useState<LocalRelay | undefined>(undefined);
  
  const [newRouterName, setNewRouterName] = useState('');
  const [newRouterPort, setNewRouterPort] = useState<number | ''>(11434);
  const [newRouterProtocols, setNewRouterProtocols] = useState<string[]>([]);

  const [relays, setRelays] = useState<LocalRelay[]>([]);

  const handleSaveAppConfig = (relayId: string, enabledTools: string[]) => {
    updateRelays((prev) =>
      prev.map((r) => (r.id === relayId ? { ...r, enabledTools } : r))
    );
    toast.success(t("workspace:app_relay_saved", "Application association updated successfully!"));
  };

  useEffect(() => {
    const initData = async () => {
      const fetchedRelays = await workspaceService.getRelays();
      const fetchedKeys = await workspaceService.getApiKeys();
      
      let updatedKeys = [...fetchedKeys];
      let needsSave = false;

      // Ensure every single relay has at least one default API Key
      for (const r of fetchedRelays) {
        const hasKey = updatedKeys.some((k) => k.relayId === r.id);
        if (!hasKey) {
          const now = new Date();
          const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
          const randomSuffix = Math.random().toString(36).substring(2, 10).toUpperCase();
          const defaultKey: LocalApiKey = {
            id: `k-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: `${r.name} Default Key`,
            key: `sk-${r.id.replace("relay-", "")}-${randomSuffix}`,
            baseUrl: `http://localhost:${r.port}`,
            enabled: true,
            timeAdded: formattedTime,
            relayId: r.id,
          };
          updatedKeys.push(defaultKey);
          needsSave = true;
        }
      }

      if (needsSave) {
        await workspaceService.saveApiKeys(updatedKeys);
      }
      
      setRelays(fetchedRelays);
    };

    initData();
  }, []);

  const updateRelays: React.Dispatch<React.SetStateAction<LocalRelay[]>> = async (action) => {
    setRelays(prev => {
      const newRelays = typeof action === 'function' ? action(prev) : action;
      workspaceService.saveRelays(newRelays).catch(console.error);
      return newRelays;
    });
  };

  const [isInstallingMap, setIsInstallingMap] = useState<Record<string, boolean>>({});
  const [installProgressMap, setInstallProgressMap] = useState<Record<string, number>>({});
  const [installTypeMap, setInstallTypeMap] = useState<Record<string, 'cli' | 'desktop'>>({});
  const [installLogsMap, setInstallLogsMap] = useState<Record<string, string[]>>({});

  const handleInstallTool = (id: string, type: 'cli' | 'desktop') => {
    if (isInstallingMap[id]) return;
    
    setIsInstallingMap(prev => ({ ...prev, [id]: true }));
    setInstallProgressMap(prev => ({ ...prev, [id]: 0 }));
    setInstallTypeMap(prev => ({ ...prev, [id]: type }));
    
    const toolName = tools.find(t => t.id === id)?.name || 'tool';
    const cleanId = id.toLowerCase();
    toast.info(`${t('workspace:installing', 'Installing')} ${toolName} ${t('workspace:via', 'via')} ${type === 'cli' ? t('workspace:cli_core', 'CLI Core') : t('workspace:desktop_client', 'Desktop Client')} ...`);

    const cliSteps = [
      { progress: 10, log: `$ npm install -g @sdkwork/modelkit-${cleanId}-cli` },
      { progress: 25, log: `[mcp] Connected to registry, downloading binary tarball...` },
      { progress: 45, log: `[info] Extracting files to workspace path (~/.sdkwork/bin/${cleanId})` },
      { progress: 65, log: `[success] SHA-256 signature matched, PGP certificate verified.` },
      { progress: 80, log: `[info] Creating global symlinks: /usr/local/bin/${cleanId}` },
      { progress: 95, log: `[info] Binding local ports (PORT 3000), testing Local Relay Daemon connection...` },
      { progress: 100, log: `[success] Component registered as active service. Ready for development.` }
    ];

    const desktopSteps = [
      { progress: 10, log: `$ curl -L -O https://releases.sdkwork.com/modelkit/${cleanId}/desktop-latest.dmg` },
      { progress: 30, log: `[info] Downloading Desktop DMG from CDN, speed: ~12.4 MB/s (76.5 MB total)...` },
      { progress: 50, log: `[info] Download complete. Mounting and extracting client to applications folder...` },
      { progress: 65, log: `[success] Security scan complete. System signature verification (Apple Gatekeeper Code Checked: OK)` },
      { progress: 80, log: `[info] Copying main app to system path: /Applications/${toolName}.app` },
      { progress: 90, log: `[info] Creating desktop shortcuts, configuring background agent service (com.sdkwork.${cleanId}.plist)` },
      { progress: 100, log: `[success] Desktop UI process daemonized, local IPC socket channel is healthy.` }
    ];

    const currentSteps = type === 'cli' ? cliSteps : desktopSteps;
    const initialLogs = [currentSteps[0].log];
    setInstallLogsMap(prev => ({ ...prev, [id]: initialLogs }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setIsInstallingMap(prev => ({ ...prev, [id]: false }));
        setInstallProgressMap(prev => ({ ...prev, [id]: 100 }));
        
        setInstallLogsMap(prev => {
          const finalLogs = [...(prev[id] || [])];
          currentSteps.forEach(s => {
            if (!finalLogs.includes(s.log)) {
              finalLogs.push(s.log);
            }
          });
          return { ...prev, [id]: finalLogs };
        });
        
        agentService.toggleAgentStatus(id, 'installed').then(() => {
          setTools(prev => prev.map(t => t.id === id ? { ...t, status: 'installed' } : t));
          toast.success(`${toolName} (${type === 'cli' ? t('workspace:cli_core', 'CLI Core') : t('workspace:desktop_client', 'Desktop Client')}) ${t('workspace:installed_success', 'installed successfully!')}`);
        });
      } else {
        setInstallProgressMap(prev => ({ ...prev, [id]: progress }));
        
        setInstallLogsMap(prev => {
          const currentLogs = [...(prev[id] || [])];
          currentSteps.forEach(step => {
            if (progress >= step.progress && !currentLogs.includes(step.log)) {
              currentLogs.push(step.log);
            }
          });
          return { ...prev, [id]: currentLogs };
        });
      }
    }, 180);
  };

  const handleUninstallTool = (id: string) => {
    const toolName = tools.find(t => t.id === id)?.name || 'tool';
    agentService.toggleAgentStatus(id, 'uninstalled').then(() => {
      setTools(prev => prev.map(t => t.id === id ? { ...t, status: 'uninstalled' } : t));
      setInstallLogsMap(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      toast.info(`${t('workspace:uninstalled_success', 'Successfully uninstalled')} ${toolName}`);
    });
  };

  useEffect(() => {
    agentService.fetchAgentTools().then(data => {
      setTools(data);
      if (data.length > 0) {
        setActiveToolId(data[0].id);
      }
      setLoading(false);
    });
  }, [agentService]);

  const activeTool = tools.find(t => t.id === activeToolId);

  const handleNavigate = (viewId: 'user-profile' | 'system-settings') => {
    setActiveTab('settings');
    setActiveToolId(viewId);
  };

  return (
    <div className="flex-1 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar 
        tools={tools} 
        loading={loading} 
        activeToolId={activeToolId} 
        setActiveToolId={(id) => { setActiveToolId(id); }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeRelayId={activeRelayId}
        setActiveRelayId={setActiveRelayId}
        relays={relays}
        onCreateRelay={() => {
           setNewRouterName(`New Router ${relays.length + 1}`);
           setNewRouterPort(11434 + relays.length);
           setNewRouterProtocols([]);
           setIsCreateModalOpen(true);
        }}
        onAppConfigClick={(relay) => {
          setActiveAppConfigRelay(relay);
          setIsAppConfigModalOpen(true);
        }}
      />

        {/* Content Area */}
        <section className="flex-1 flex flex-col bg-panel">
          {activeTab === 'vip' ? (
            <VipPurchaseView 
              onNavigate={handleNavigate} 
              onVipStatusChanged={() => {
                workspaceService.getVipStatus().then(status => setIsVip(status.isActive));
              }} 
            />
          ) : activeTab === 'request-logs' ? (
            <RequestLogsView onNavigate={handleNavigate} />
          ) : activeTab === 'usage' ? (
            <UsageView onNavigate={handleNavigate} />
          ) : activeTab === 'relay' ? (
            activeRelayId === 'api-keys' ? (
                  <ApiKeyManager onNavigate={handleNavigate} tools={tools} />
            ) : (
              <LocalRelayManager 
                relay={relays.find(r => r.id === activeRelayId)}
                setRelays={updateRelays}
                onDelete={() => setActiveRelayId(null)}
                onNavigate={handleNavigate}
                tools={tools}
              />
            )
          ) : activeToolId === 'system-settings' ? (
            <SystemSettings onNavigate={handleNavigate} />
          ) : activeToolId === 'user-profile' ? (
            <UserProfile onNavigate={handleNavigate} key={isVip ? 'vip-active' : 'vip-inactive'} />
          ) : activeTool ? (
            <WorkspaceView 
              activeTool={activeTool} 
              isInstalling={isInstallingMap[activeTool.id]} 
              installProgress={installProgressMap[activeTool.id] || 0} 
              installType={installTypeMap[activeTool.id]}
              installLogs={installLogsMap[activeTool.id] || []}
              onInstall={handleInstallTool} 
              onUninstall={handleUninstallTool}
              onNavigate={handleNavigate}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-text-muted">
              {t('workspace:select_agent_from_sidebar', 'Please select an agent from the sidebar.')}
            </div>
          )}
        </section>
        
        <LocalGatewayCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          newRouterName={newRouterName}
          setNewRouterName={setNewRouterName}
          newRouterPort={newRouterPort as number}
          setNewRouterPort={(port: number) => setNewRouterPort(port)}
          newRouterProtocols={newRouterProtocols}
          setNewRouterProtocols={setNewRouterProtocols}
          onCreate={() => {
            const newRelayId = `relay-${Date.now()}`;
            const newRelay: LocalRelay = {
              id: newRelayId,
              name: newRouterName || 'Untitled Router',
              port: (newRouterPort as number) || 11434,
              status: 'stopped',
              providers: [],
              protocols: newRouterProtocols
            };
            updateRelays([...relays, newRelay]);
            setActiveRelayId(newRelay.id);
            setActiveTab('relay');
            setIsCreateModalOpen(false);

            // Auto-create default API Key in preference-backed workspace state
            const now = new Date();
            const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const randomSuffix = Math.random().toString(36).substring(2, 10).toUpperCase();
            const defaultKey: LocalApiKey = {
              id: `k-${Date.now()}`,
              name: `${newRelay.name} Default Key`,
              key: `sk-${newRelayId.replace('relay-', '')}-${randomSuffix}`,
              baseUrl: `http://localhost:${newRelay.port}`,
              enabled: true,
              timeAdded: formattedTime,
              relayId: newRelayId
            };

            workspaceService.getApiKeys().then(keys => {
              workspaceService.saveApiKeys([defaultKey, ...keys]);
            });

            toast.success(t('workspace:workspace_relay_created', 'Workspace relay created with default API key'));
          }}
        />

        <RelayAppConfigModal
          isOpen={isAppConfigModalOpen}
          onClose={() => setIsAppConfigModalOpen(false)}
          relay={activeAppConfigRelay}
          tools={tools}
          onSave={handleSaveAppConfig}
        />
    </div>
  );
}
