import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { SkillCard } from "./SkillCard";
import { useService } from "@sdkwork/modelkit-core";
import {
  IResourcesService,
  IResourcesServiceToken,
  SkillConfig,
} from "@sdkwork/modelkit-services";
import { SkillAddEditModal } from "../../modals/SkillAddEditModal";

export function SkillsManager() {
  const resourcesService = useService<IResourcesService>(
    IResourcesServiceToken,
  );
  const [skills, setSkills] = useState<SkillConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SkillConfig>>({});

  useEffect(() => {
    resourcesService.fetchSkills().then((data) => {
      setSkills(data);
      setLoading(false);
    });
  }, [resourcesService]);

  const handleOpenAdd = () => {
    setModalMode("add");
    setFormData({ type: "function", tags: ["Custom"] });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const skill = skills.find((s) => s.id === id);
    if (skill) {
      setModalMode("edit");
      setFormData(skill);
      setEditingId(id);
      setIsModalOpen(true);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      toast.error("Name and Description are required");
      return;
    }

    if (modalMode === "add") {
      const newSkill = await resourcesService.createSkill(formData);
      setSkills([...skills, newSkill]);
      toast.success("Skill created successfully");
    } else if (editingId) {
      const updatedSkill = await resourcesService.updateSkill(
        editingId,
        formData,
      );
      setSkills(skills.map((s) => (s.id === editingId ? updatedSkill : s)));
      toast.success("Skill updated successfully");
    }
    setIsModalOpen(false);
  };

  const handleTest = (id: string) => {
    const skill = skills.find((s) => s.id === id);
    toast.success(`Testing skill: ${skill?.name}`);
  };

  const handleDelete = async (id: string) => {
    await resourcesService.deleteSkill(id);
    const skill = skills.find((s) => s.id === id);
    setSkills(skills.filter((s) => s.id !== id));
    toast.success(`Skill ${skill?.name} deleted`);
  };

  const filteredSkills = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
            Skills Management{" "}
            <span className="text-sm text-text-muted font-normal">
              {filteredSkills.length} skills
            </span>
          </h1>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2 border border-divider hover:border-divider-strong rounded-lg text-sm font-semibold bg-primary-main hover:bg-primary-hover text-white transition-colors flex items-center justify-center gap-2 shadow-sm shadow-primary-main/20"
          >
            <Plus size={16} />
            Create Skill
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-6 bg-surface/50 p-4 rounded-xl border border-divider">
          <div className="relative w-full md:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-panel border border-surface-hover rounded-lg pl-9 pr-4 py-2 text-[13px] text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted font-sans"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          {filteredSkills.length === 0 ? (
            <div className="text-center py-20 text-text-muted font-medium bg-surface/30 rounded-xl border border-dashed border-surface-hover">
              No skills matched your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredSkills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onTest={handleTest}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <SkillAddEditModal
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
