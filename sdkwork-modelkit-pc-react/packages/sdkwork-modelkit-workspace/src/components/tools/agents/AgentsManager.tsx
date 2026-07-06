import React, { useState, useEffect } from "react";
import { Plus, Bot, Cpu, Wrench, Play, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { useService } from "@sdkwork/modelkit-core";
import {
  IAgentService,
  IAgentServiceToken,
  AgentConfig,
} from "@sdkwork/modelkit-services";
import { AgentAddEditModal } from "../../modals/AgentAddEditModal";

export function AgentsManager() {
  const agentService = useService<IAgentService>(IAgentServiceToken);
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<AgentConfig>>({});

  useEffect(() => {
    agentService.fetchAgents().then((data) => {
      setAgents(data);
      setLoading(false);
    });
  }, [agentService]);

  const handleOpenAdd = () => {
    setModalMode("add");
    setFormData({ model: "gpt-4o", type: "Assistant", skills: [], mcp: [] });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const agent = agents.find((a) => a.id === id);
    if (agent) {
      setModalMode("edit");
      setFormData(agent);
      setEditingId(id);
      setIsModalOpen(true);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.task) {
      toast.error("Name and Task are required");
      return;
    }

    if (modalMode === "add") {
      const newAgent = await agentService.createAgent(formData);
      setAgents([...agents, newAgent]);
      toast.success("Agent created successfully");
    } else if (editingId) {
      const updatedAgent = await agentService.updateAgent(editingId, formData);
      setAgents(agents.map((a) => (a.id === editingId ? updatedAgent : a)));
      toast.success("Agent updated successfully");
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    await agentService.deleteAgent(id);
    setAgents(agents.filter((a) => a.id !== id));
    toast.success("Agent removed");
  };

  const handleInteract = (agent: AgentConfig) => {
    toast.success(`Connecting ${agent.name}...`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-6 h-6 border-2 border-[var(--color-primary-alpha)] border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-canvas text-text-main font-sans overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[24px] font-semibold tracking-tight text-text-main flex items-baseline gap-3">
            Agents Management{" "}
            <span className="text-sm text-text-muted font-normal">
              {agents.length} agents
            </span>
          </h1>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2 border border-divider hover:border-divider-strong rounded-lg text-sm font-semibold bg-primary-main hover:bg-primary-hover text-white transition-colors flex items-center justify-center gap-2 shadow-sm shadow-primary-main/20"
          >
            <Plus size={16} />
            Create Agent
          </button>
        </div>

        <div className="flex-1 flex flex-col min-w-0 pt-2">
          {agents.length === 0 ? (
            <div className="text-center py-20 text-text-muted font-medium bg-surface/30 rounded-xl border border-dashed border-surface-hover">
              No agents configured.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-surface border border-surface-hover rounded-xl p-5 hover:border-divider-strong hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)] transition-all flex flex-col group relative overflow-hidden"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-primary-main/10 border border-[var(--color-primary-alpha)] flex items-center justify-center text-primary-light shrink-0">
                      <Bot size={24} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-text-main text-base truncate">
                        {agent.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-text-muted font-medium whitespace-nowrap bg-panel px-1.5 py-0.5 rounded border border-divider max-w-full overflow-hidden text-ellipsis">
                        <Cpu
                          size={12}
                          className="text-primary-light shrink-0"
                        />{" "}
                        <span className="truncate">{agent.model}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[13px] leading-[1.6] text-text-muted mb-6 flex-1 line-clamp-3">
                    {agent.task}
                  </p>

                  <div className="flex items-center gap-2 pt-4 border-t border-surface-hover flex-wrap">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold tracking-wide uppercase bg-panel px-2 py-1 rounded border border-surface-hover">
                        <Wrench size={10} />
                        {(agent.skills?.length || 0) +
                          (agent.mcp?.length || 0)}{" "}
                        Tools
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-primary-light font-bold tracking-wide uppercase bg-primary-main/10 px-2 py-1 rounded border border-[var(--color-primary-alpha)]">
                        {agent.type}
                      </div>
                    </div>
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-surface/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-200">
                    <button
                      onClick={() => handleInteract(agent)}
                      className="p-3 rounded-full bg-primary-main hover:bg-primary-hover text-white shadow-lg shadow-primary-main/20 transition-transform hover:scale-110"
                      title="Talk to Agent"
                    >
                      <Play size={18} fill="currentColor" />
                    </button>
                    <button
                      onClick={() => handleEdit(agent.id)}
                      className="p-3 rounded-full bg-panel hover:bg-divider-strong text-text-main shadow-lg border border-divider transition-transform hover:scale-110"
                      title="Edit settings"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="p-3 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 shadow-lg transition-transform hover:scale-110"
                      title="Delete Agent"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AgentAddEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalMode={modalMode}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
      />
    </div>
  );
}
