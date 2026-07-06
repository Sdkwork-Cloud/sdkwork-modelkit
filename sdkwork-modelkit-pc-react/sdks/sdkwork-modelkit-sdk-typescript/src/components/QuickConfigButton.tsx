import React, { useState } from 'react';
import { LayoutMode, ToolDefinition } from '../types';
import { QuickConfigComponent } from './QuickConfigComponent';
import { Sparkles } from 'lucide-react';

interface QuickConfigButtonProps {
  apiKey: string;
  baseUrl?: string;
  name: string;
  description?: string;
  layoutMode?: LayoutMode;
  onDirectConfig?: (toolId: string, toolName: string) => void;
  customScheme?: string;
  className?: string;
  label?: string;
  tools?: ToolDefinition[];
}

export function QuickConfigButton({
  apiKey,
  baseUrl = '',
  name,
  description = 'Local Workspace Main Key',
  layoutMode = 'drawer',
  onDirectConfig,
  customScheme = 'modelkit://config',
  className = '',
  label = '立即使用',
  tools
}: QuickConfigButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${className} flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-extrabold text-[#3B82F6] bg-blue-500/10 border border-blue-500/15 hover:bg-blue-600 hover:text-white transition-all duration-150 cursor-pointer shadow-sm`}
        title={`一键配置与分发秘钥 - ${name}`}
      >
        <Sparkles size={12} className="shrink-0" />
        <span>{label}</span>
      </button>

      {/* Renders the drawer or modal component when isOpen */}
      <QuickConfigComponent
        apiKey={apiKey}
        baseUrl={baseUrl}
        name={name}
        description={description}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        layoutMode={layoutMode}
        onDirectConfig={onDirectConfig}
        customScheme={customScheme}
        tools={tools}
      />
    </>
  );
}
