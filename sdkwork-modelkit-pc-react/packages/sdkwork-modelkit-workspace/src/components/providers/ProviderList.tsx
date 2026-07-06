import React from "react";
import {
  Pencil,
  Copy,
  Link as LinkIcon,
  Trash2,
  GripVertical,
  Play,
  Zap,
  Check,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

// We import from types.ts instead of redefining
import { ProviderData } from "../../services/types";

// We add 'enabled' as an extra field if the app needs it for UI state
export type UIProviderData = ProviderData & { enabled?: boolean };

interface ProviderListProps {
  providers: UIProviderData[];
  setProviders: (providers: UIProviderData[]) => void;
  onEdit: (provider: UIProviderData) => void;
  onDelete: (id: string) => void;
  onCopy: (provider: UIProviderData) => void;
  onTest: (provider: UIProviderData) => void;
}

export function ProviderList({
  providers,
  setProviders,
  onEdit,
  onDelete,
  onCopy,
  onTest,
}: ProviderListProps) {
  const toggleProvider = (id: string) => {
    setProviders(
      providers.map((p) => ({
        ...p,
        enabled: p.id === id ? true : false,
      })),
    );
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const newProviders = Array.from(providers);
    const [removed] = newProviders.splice(sourceIndex, 1);
    newProviders.splice(destinationIndex, 0, removed);

    setProviders(newProviders);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="providers-list">
        {(provided) => (
          <div
            className="flex flex-col gap-2"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {providers.map((provider, index) => {
              const AnyDraggable = Draggable as any;
              return (
                <AnyDraggable
                  key={provider.id?.toString()}
                  draggableId={provider.id?.toString() || `${index}`}
                  index={index}
                >
                  {(provided: any, snapshot: any) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`relative flex items-center justify-between p-3 rounded-xl border transition-all duration-300 group overflow-hidden ${
                        snapshot.isDragging
                          ? "border-primary-main shadow-lg shadow-blue-500/10 bg-panel"
                          : provider.enabled
                            ? "border-emerald-500/30 bg-emerald-500/[0.02] shadow-[0_2px_10px_rgba(16,185,129,0.05)]"
                            : "bg-surface border-divider hover:border-divider-strong"
                      }`}
                    >
                      {provider.enabled && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] z-10" />
                      )}
                      <div className="flex items-center gap-4 relative z-10">
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab text-text-muted hover:text-text-muted focus:outline-none"
                        >
                          <GripVertical size={16} />
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-surface-hover border border-surface-hover flex items-center justify-center text-text-main font-bold text-lg shadow-inner shrink-0">
                          {provider.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-sm font-bold text-text-main mb-0.5">
                            {provider.name}
                          </h3>
                          <div
                            className={`text-xs font-mono truncate max-w-[200px] sm:max-w-xs md:max-w-md ${provider.url ? "text-primary-main hover:underline cursor-pointer" : "text-text-muted"}`}
                          >
                            {provider.url || "No endpoint specified"}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`relative z-10 flex items-center gap-4 transition-opacity ${snapshot.isDragging ? "opacity-100" : "opacity-80 group-hover:opacity-100"}`}
                      >
                        <button
                          onClick={() => toggleProvider(provider.id!)}
                          className={`group relative flex items-center gap-2.5 px-3 pl-2 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                            provider.enabled
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:border-emerald-500/50"
                              : "bg-surface hover:bg-panel text-text-muted hover:text-text-main border border-divider hover:border-divider-strong shadow-sm opacity-80 hover:opacity-100"
                          }`}
                        >
                          {provider.enabled && (
                            <div className="absolute inset-0 rounded-lg overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                            </div>
                          )}
                          <div
                            className={`relative flex items-center justify-center w-5 h-5 rounded-[6px] shadow-sm transition-all duration-300 ${
                              provider.enabled
                                ? "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)] scale-100"
                                : "bg-panel border border-divider text-text-muted group-hover:text-text-main scale-95 group-hover:scale-100"
                            }`}
                          >
                            {provider.enabled ? (
                              <>
                                <div className="absolute inset-0 rounded-[6px] bg-emerald-400 animate-ping opacity-30" />
                                <Check size={12} strokeWidth={3.5} />
                              </>
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-divider-strong group-hover:bg-text-muted transition-colors" />
                            )}
                          </div>
                          <span className="tracking-widest relative z-10 text-[10px] uppercase">
                            {provider.enabled ? "ACTIVE" : "ENABLE"}
                          </span>
                        </button>

                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => onTest(provider)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-yellow-500/80 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                            title="Test"
                          >
                            <Zap size={14} className="fill-yellow-500/20" />
                          </button>
                          <button
                            onClick={() => onEdit(provider)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => onCopy(provider)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
                            title="Duplicate"
                          >
                            <Copy size={14} />
                          </button>
                          {provider.url ? (
                            <a
                              href={provider.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
                              title="Open Link"
                            >
                              <LinkIcon size={14} />
                            </a>
                          ) : (
                            <button
                              disabled
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted/50 cursor-not-allowed"
                              title="No Link"
                            >
                              <LinkIcon size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(provider.id!)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500/80 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </AnyDraggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
