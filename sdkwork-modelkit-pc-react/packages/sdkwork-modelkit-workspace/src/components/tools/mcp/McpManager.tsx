import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Download,
  Star,
  X,
  Settings,
  Key,
  Globe,
  Terminal,
  Blocks,
  Zap,
  Database,
  Shield,
  Command,
  Plug,
  PenTool,
  CheckCircle2,
  Box,
  ArrowLeft,
  TerminalSquare,
  Server,
  Activity,
  Power,
  Trash2,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";
import { useAppContext, useService } from "@sdkwork/modelkit-core";
import {
  IResourcesService,
  IResourcesServiceToken,
  MCPConfig,
} from "@sdkwork/modelkit-services";
import { McpAddServerModal } from "../../modals/McpAddServerModal";

export function McpManager() {
  const { t } = useAppContext();
  const resourcesService = useService<IResourcesService>(
    IResourcesServiceToken,
  );

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProtocol, setSelectedProtocol] = useState("All Protocols");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGrid, setIsGrid] = useState(false);
  const [selectedServer, setSelectedServer] = useState<number | null>(null);

  const [servers, setServers] = useState<MCPConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resourcesService.fetchMCPs().then((data) => {
      setServers(data);
      setLoading(false);
    });
  }, [resourcesService]);

  // Form states for Add Server
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<MCPConfig>>({});

  const getIcon = (server: MCPConfig, size = 22) => {
    return server.protocol === "stdio" ? (
      <Terminal size={size} className="text-primary-main" />
    ) : (
      <Globe size={size} className="text-green-500" />
    );
  };

  const categories = [
    "All",
    "Core",
    "Dev Tools",
    "Database",
    "Search",
    "Communication",
    "Remote",
    "Other",
  ];
  const protocols = ["All Protocols", "stdio", "sse"];
  const statuses = ["All Statuses", "connected", "disconnected", "error"];

  const filteredServers = useMemo(() => {
    return servers.filter((server) => {
      const matchCat =
        selectedCategory === "All" ? true : server.type === selectedCategory;
      const matchProtocol =
        selectedProtocol === "All Protocols"
          ? true
          : server.protocol === selectedProtocol;
      const matchStatus =
        selectedStatus === "All Statuses"
          ? true
          : server.status === selectedStatus;
      const matchSearch =
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchProtocol && matchStatus && matchSearch;
    });
  }, [
    servers,
    selectedCategory,
    selectedProtocol,
    selectedStatus,
    searchQuery,
  ]);

  const toggleStatus = async (id: number, current: string) => {
    toast.info(
      current === "connected"
        ? "Disconnecting MCP server..."
        : "Connecting to MCP server...",
    );
    await resourcesService.toggleMCPStatus(id, current);
    const updatedServers = await resourcesService.fetchMCPs();
    setServers(updatedServers);
    const newStatus = current === "connected" ? "disconnected" : "connected";
    toast.success(`Server ${newStatus}`);
  };

  const handleDelete = async (id: number) => {
    await resourcesService.deleteMCP(id);
    const updatedServers = await resourcesService.fetchMCPs();
    setServers(updatedServers);
    if (selectedServer === id) setSelectedServer(null);
    toast.success("MCP Server removed successfully");
  };

  const handleOpenAdd = () => {
    setModalMode("add");
    setFormData({
      type: "Core",
      protocol: "stdio",
      capabilities: ["Custom App"],
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const server = servers.find((s) => s.id === id);
    if (server) {
      setModalMode("edit");
      setFormData(server);
      setEditingId(id);
      setIsModalOpen(true);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.author || !formData.desc) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (formData.protocol === "stdio" && !formData.command) {
      toast.error("Command is required for stdio protocol");
      return;
    }
    if (formData.protocol === "sse" && !formData.url) {
      toast.error("SSE URL is required for sse protocol");
      return;
    }

    const payload: Partial<MCPConfig> = {
      ...formData,
      author: formData.author?.startsWith("@")
        ? formData.author
        : `@${formData.author}`,
      capabilities:
        formData.capabilities && formData.capabilities.length > 0
          ? formData.capabilities
          : ["Custom App"],
    };

    if (modalMode === "add") {
      const newServerItem = await resourcesService.addMCP(payload);
      setServers([newServerItem, ...servers]);
      toast.success("MCP Server added successfully");
    } else if (editingId) {
      const updatedServer = await resourcesService.editMCP(editingId, payload);
      setServers(servers.map((s) => (s.id === editingId ? updatedServer : s)));
      toast.success("MCP Server updated successfully");
    }
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-6 h-6 border-2 border-[var(--color-primary-alpha)] border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full bg-canvas text-text-main font-sans overflow-hidden">
      {/* Sidebar for MCP Navigation */}
      {!selectedServer && (
      <div className="w-[220px] border-r border-divider bg-panel flex flex-col py-5 shrink-0 h-full">
        <div className="px-5 mb-5">
          <h2 className="text-md font-bold tracking-tight text-text-main flex items-center gap-2">
            <Server size={16} className="text-text-muted" />
            {t("workspace:mcp_servers")}
          </h2>
        </div>

        <div className="relative px-3 mb-5">
          <Search size={13} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder={t("workspace:search_mcp_servers")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-divider rounded-lg pl-8.5 pr-3 py-1.5 text-xs focus:outline-none focus:border-primary-main/50 transition-colors text-text-main placeholder:text-text-muted"
          />
        </div>

        <div className="flex-1 px-2.5 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] uppercase font-bold tracking-widest text-text-muted px-3 py-1.5">Discover</div>
          
          <button
            onClick={() => setSelectedCategory('All')}
            className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedCategory === 'All'
                ? 'text-primary-light bg-primary-main/10 font-bold border border-primary-main/10'
                : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            All Servers
          </button>

          <div className="text-[10px] uppercase font-bold tracking-widest text-text-muted px-3 pt-5 pb-1.5">Categories</div>
          {categories.filter(c => c !== 'All').map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedCategory === cat
                  ? 'text-primary-light bg-primary-main/10 font-bold border border-primary-main/10'
                  : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {t(cat, cat)}
            </button>
          ))}
        </div>

        <div className="p-3 mt-auto border-t border-divider">
          <button
            onClick={handleOpenAdd}
            className="w-full py-2 bg-primary-main hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 active:scale-[0.98]"
          >
            <Plug size={14} className="inline-block" />
            {t("workspace:add_server")}
          </button>
        </div>
      </div>
      )}

      {/* Main Container */}
      {!selectedServer ? (
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[24px] font-semibold tracking-tight text-text-main flex items-baseline gap-3">
              {selectedCategory === 'All' ? 'All Servers' : t(selectedCategory, selectedCategory)}
              <span className="text-sm text-text-muted font-normal">
                {filteredServers.length} {t("workspace:servers")}
              </span>
            </h1>
          </div>

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6 bg-surface/50 p-4 rounded-xl border border-divider">
            <div className="flex items-center gap-2 overflow-x-auto stylish-scrollbar pb-1 xl:pb-0 hide-scrollbar-on-desktop">
              <div className="flex items-center gap-2">
                <select
                  value={selectedProtocol}
                  onChange={(e) => setSelectedProtocol(e.target.value)}
                  className="bg-panel border border-surface-hover rounded-lg px-3 py-2 text-[13px] text-text-main outline-none focus:border-primary-main/50"
                >
                  {protocols.map((prot) => (
                    <option key={prot} value={prot}>
                      {t(prot, prot)}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-panel border border-surface-hover rounded-lg px-3 py-2 text-[13px] text-text-main outline-none focus:border-primary-main/50"
                >
                  {statuses.map((stat) => (
                    <option key={stat} value={stat} className="capitalize">
                      {t(stat, stat)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center bg-panel border border-surface-hover rounded-lg p-0.5">
                <button
                  onClick={() => setIsGrid(false)}
                  className={`p-1.5 rounded-md text-text-muted transition-colors ${!isGrid ? "bg-surface shadow-sm text-primary-main" : "hover:text-text-main"}`}
                  title={t("workspace:list")}
                >
                  <Command size={15} />
                </button>
                <button
                  onClick={() => setIsGrid(true)}
                  className={`p-1.5 rounded-md text-text-muted transition-colors ${isGrid ? "bg-surface shadow-sm text-primary-main" : "hover:text-text-main"}`}
                  title={t("workspace:grid")}
                >
                  <Blocks size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <div
              className={
                isGrid
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                  : "flex flex-col gap-3"
              }
            >
              {filteredServers.map((server) => (
                <div
                  key={server.id}
                  onClick={() => setSelectedServer(server.id)}
                  className={`group relative hover:bg-surface transition-all cursor-pointer border ${isGrid ? "p-5 rounded-2xl border-surface-hover hover:border-divider-strong flex flex-col shadow-sm" : "p-4 rounded-xl border-transparent hover:border-surface-hover flex items-center gap-5"}`}
                >
                  <div
                    className={`shrink-0 rounded-xl bg-panel border border-surface-hover flex items-center justify-center shadow-inner ${isGrid ? "w-14 h-14 mb-4" : "w-12 h-12"}`}
                  >
                    {getIcon(server, isGrid ? 24 : 20)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="flex items-baseline gap-2 truncate">
                        <span className="text-text-muted text-xs">
                          {server.author}
                        </span>
                        <span className="text-text-muted/50 text-[10px]">
                          /
                        </span>
                        <h3
                          className={`font-bold text-text-main truncate ${isGrid ? "text-[16px]" : "text-[15px]"}`}
                        >
                          {server.name}
                        </h3>
                      </div>
                      <span
                        className={`flex items-center gap-1 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                          server.status === "connected"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : server.status === "error"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-gray-500/10 text-text-muted border-gray-500/20"
                        }`}
                      >
                        <Activity size={10} /> {server.status}
                      </span>
                    </div>
                    <p
                      className={`text-[13px] text-text-muted leading-[1.6] ${isGrid ? "line-clamp-2 mb-4 h-[40px]" : "truncate pr-24"}`}
                    >
                      {server.desc}
                    </p>

                    {isGrid && (
                      <div className="flex items-center gap-4 text-[11px] text-text-muted font-medium mt-auto">
                        <span className="bg-surface px-2 py-1 rounded-md text-text-main font-mono border border-surface-hover shadow-sm">
                          {server.protocol}
                        </span>
                        <span className="flex items-center gap-1">
                          <Database size={12} className="text-primary-light" />{" "}
                          {server.resources}
                        </span>
                        <span className="flex items-center gap-1">
                          <PenTool size={12} className="text-emerald-400" />{" "}
                          {server.tools}
                        </span>
                      </div>
                    )}
                  </div>

                  {!isGrid && (
                    <div className="flex items-center gap-4 text-[11px] text-text-muted font-medium shrink-0 mr-8">
                      <span className="flex items-center gap-1 w-16">
                        <Database size={14} className="text-primary-light" />{" "}
                        {server.resources}
                      </span>
                      <span className="flex items-center gap-1 w-16">
                        <PenTool size={14} className="text-emerald-400" />{" "}
                        {server.tools}
                      </span>
                    </div>
                  )}

                  <div
                    className={
                      isGrid
                        ? "mt-5 pt-4 border-t border-surface-hover"
                        : "absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    }
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatus(server.id, server.status);
                      }}
                      className={
                        isGrid
                          ? `w-full px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                              server.status === "connected"
                                ? "border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10"
                                : "border-divider hover:border-divider-strong text-text-main bg-panel"
                            }`
                          : `px-4 py-2 rounded-lg text-[13px] font-semibold border transition-colors ${
                              server.status === "connected"
                                ? "border-red-500/30 text-red-500 bg-red-500/10 hover:bg-red-500/20"
                                : "border-divider shadow-sm hover:bg-surface-hover text-text-main bg-surface"
                            }`
                      }
                    >
                      {server.status === "connected" ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          {(() => {
            const server = servers.find((s) => s.id === selectedServer)!;
            return (
              <div className="w-full p-6 lg:p-8">
                <button
                  onClick={() => setSelectedServer(null)}
                  className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-10 group"
                >
                  <ArrowLeft
                    size={18}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  <span className="font-medium">
                    {t("workspace:back_to_mcp_servers")}
                  </span>
                </button>

                <div className="flex items-start justify-between gap-8 mb-12">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-surface border border-divider flex items-center justify-center shrink-0 shadow-lg">
                      {getIcon(server, 40)}
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-text-main mb-3 tracking-tight flex items-center gap-4">
                        {server.name}
                        <span
                          className={`flex items-center gap-1.5 text-xs uppercase font-bold px-2 py-1 rounded border tracking-wider mt-1 ${
                            server.status === "connected"
                              ? "bg-green-500/10 text-green-400 border-green-500/30"
                              : server.status === "error"
                                ? "bg-red-500/10 text-red-400 border-red-500/30"
                                : "bg-gray-500/10 text-text-muted border-gray-500/30"
                          }`}
                        >
                          <Activity size={14} /> {server.status}
                        </span>
                      </h1>
                      <p className="text-lg text-text-muted font-medium">
                        by{" "}
                        <span className="text-text-main">{server.author}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStatus(server.id, server.status)}
                    className={`px-8 py-3.5 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center gap-2 ${
                      server.status === "connected"
                        ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                        : "bg-surface text-text-main hover:scale-105 transform"
                    }`}
                  >
                    <Power size={20} />
                    {server.status === "connected" ? "Disconnect" : "Connect"}
                  </button>
                </div>

                <div className="flex items-center gap-12 mb-14 text-sm text-text-muted border-y border-surface-hover py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary-light">
                      <Terminal size={20} />
                    </div>
                    <div>
                      <div className="text-text-main text-lg font-bold uppercase">
                        {server.protocol}
                      </div>
                      <div>Protocol</div>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-surface-hover"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary-light">
                      <Database size={20} />
                    </div>
                    <div>
                      <div className="text-text-main text-lg font-bold">
                        {server.resources}
                      </div>
                      <div>Resources</div>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-surface-hover"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-emerald-400">
                      <PenTool size={20} />
                    </div>
                    <div>
                      <div className="text-text-main text-lg font-bold">
                        {server.tools}
                      </div>
                      <div>Tools</div>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-surface-hover"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-orange-400">
                      <Command size={20} />
                    </div>
                    <div>
                      <div className="text-text-main text-lg font-bold">
                        {server.prompts}
                      </div>
                      <div>Prompts</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-12">
                    <section>
                      <h2 className="text-xl font-bold text-text-main mb-4">
                        Overview
                      </h2>
                      <p className="text-[16px] text-text-main leading-relaxed font-medium">
                        {server.desc}
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-text-main mb-4">
                        Connection Command / URL
                      </h2>
                      <div className="bg-surface border border-surface-hover rounded-xl p-4 flex items-center gap-4">
                        <TerminalSquare
                          size={20}
                          className="text-primary-main shrink-0"
                        />
                        <code className="font-mono text-sm text-text-main break-all">
                          {server.command || server.url}
                        </code>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-text-main mb-4">
                        Capabilities
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {server.capabilities.map((cap, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-surface border border-surface-hover rounded-lg text-sm text-text-main font-medium"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </section>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-surface border border-surface-hover rounded-2xl p-6">
                      <h3 className="text-sm font-bold text-text-main uppercase tracking-widest mb-5 flex items-center gap-2">
                        <Settings size={16} className="text-text-muted" />{" "}
                        Actions
                      </h3>
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => handleEdit(server.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-divider-strong hover:bg-surface text-text-main text-sm font-medium transition-colors"
                        >
                          <Edit3 size={16} /> Edit Configuration
                        </button>
                        <button
                          onClick={() => {
                            setServers(
                              servers.filter((s) => s.id !== server.id),
                            );
                            setSelectedServer(null);
                            toast.success("MCP server removed");
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-500 text-sm font-medium transition-colors"
                        >
                          <Trash2 size={16} /> Delete Server
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Add / Edit Server Modal */}
      <McpAddServerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalMode={modalMode}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        categories={categories}
      />
    </div>
  );
}
