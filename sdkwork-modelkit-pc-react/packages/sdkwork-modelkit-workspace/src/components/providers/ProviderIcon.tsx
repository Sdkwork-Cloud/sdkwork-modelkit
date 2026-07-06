import React from "react";
import {
  Box,
  Code,
  Cpu,
  Database,
  Globe,
  Sliders,
  TerminalSquare,
  Code2,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

export const ProviderIcon = ({
  name,
  iconName,
  className,
}: {
  name?: string;
  iconName?: string;
  className?: string;
}) => {
  if (iconName) {
    if (iconName === "TerminalSquare")
      return <TerminalSquare className={className} />;
    if (iconName === "Code2") return <Code2 className={className} />;
    if (iconName === "Sparkles") return <Sparkles className={className} />;
    if (iconName === "Terminal") return <Terminal className={className} />;
    if (iconName === "Globe") return <Globe className={className} />;
    if (iconName === "Zap") return <Zap className={className} />;
  }

  if (!name) return <Sliders className={className} />;

  const n = name.toLowerCase();

  if (n.includes("openai") || n.includes("gpt"))
    return <Cpu className={className} />;
  if (n.includes("anthropic") || n.includes("claude"))
    return <Box className={className} />;
  if (n.includes("google") || n.includes("gemini") || n.includes("palm"))
    return <Cpu className={className} />;
  if (n.includes("meta") || n.includes("llama"))
    return <Database className={className} />;
  if (n.includes("api") || n.includes("http"))
    return <Globe className={className} />;
  if (n.includes("code")) return <Code className={className} />;

  return <Sliders className={className} />;
};

export const getProviderIcon = (
  name: string,
  className?: string,
  iconName?: string,
) => {
  return <ProviderIcon name={name} iconName={iconName} className={className} />;
};
