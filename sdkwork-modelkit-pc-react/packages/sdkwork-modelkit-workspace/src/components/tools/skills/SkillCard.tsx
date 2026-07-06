import React from "react";
import { Code2, Play, Pencil, Trash2, Globe, Database } from "lucide-react";
import { SkillConfig } from "@sdkwork/modelkit-services";

interface SkillCardProps {
  key?: React.Key;
  skill: SkillConfig;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTest: (id: string) => void;
}

const getTypeIcon = (type: SkillConfig["type"]) => {
  switch (type) {
    case "function":
      return <Code2 size={20} className="text-primary-light" />;
    case "rest":
      return <Globe size={20} className="text-emerald-400" />;
    case "graphql":
      return <Database size={20} className="text-primary-light" />;
    default:
      return <Code2 size={20} className="text-text-muted" />;
  }
};

const getTypeColor = (type: SkillConfig["type"]) => {
  switch (type) {
    case "function":
      return "text-primary-light bg-primary-main/10 border-[var(--color-primary-alpha)]";
    case "rest":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "graphql":
      return "text-primary-light bg-primary-main/10 border-primary-main/20";
    default:
      return "text-text-muted bg-gray-500/10 border-gray-500/20";
  }
};

export function SkillCard({ skill, onEdit, onDelete, onTest }: SkillCardProps) {
  return (
    <div className="bg-surface border border-surface-hover rounded-xl p-5 hover:border-divider-strong hover:shadow-lg transition-all group flex flex-col h-full relative cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface border border-surface-hover flex items-center justify-center shrink-0">
            {getTypeIcon(skill.type)}
          </div>
          <div>
            <h3 className="font-semibold text-text-main text-sm">
              {skill.name}
            </h3>
            <span
              className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase mt-1 inline-block ${getTypeColor(skill.type)}`}
            >
              {skill.type}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-text-muted mb-6 flex-1 line-clamp-2">
        {skill.description}
      </p>

      <div className="flex items-center gap-2 pt-4 border-t border-surface-hover opacity-60 group-hover:opacity-100 transition-opacity mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTest(skill.id);
          }}
          title="Test Skill"
          className="p-1.5 text-text-muted hover:text-text-main hover:bg-surface-hover rounded-md transition-colors"
        >
          <Play size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(skill.id);
          }}
          title="Edit Skill"
          className="p-1.5 text-text-muted hover:text-text-main hover:bg-surface-hover rounded-md transition-colors"
        >
          <Pencil size={14} />
        </button>
        <div className="flex-1"></div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(skill.id);
          }}
          title="Delete Skill"
          className="p-1.5 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
