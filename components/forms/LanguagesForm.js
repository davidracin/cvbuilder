"use client"

import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const LANGUAGE_LEVELS = [
  { value: "A1", label: "A1 - Začátečník" },
  { value: "A2", label: "A2 - Mírně pokročilý" },
  { value: "B1", label: "B1 - Středně pokročilý" },
  { value: "B2", label: "B2 - Pokročilý" },
  { value: "C1", label: "C1 - Velmi pokročilý" },
  { value: "C2", label: "C2 - Rodilý mluvčí" },
  { value: "Začátečník", label: "Začátečník" },
  { value: "Středně pokročilý", label: "Středně pokročilý" },
  { value: "Pokročilý", label: "Pokročilý" },
  { value: "Rodilý mluvčí", label: "Rodilý mluvčí" },
];

function SortableLanguageItem({ language, onUpdate, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: language.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-2 p-2 border border-sidebar-border rounded bg-sidebar/50 flex items-center gap-2"
    >
      <button
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      
      <div className="flex-1 grid grid-cols-2 gap-2">
        <input 
          type="text" 
          className="p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground focus:ring-2 focus:ring-sidebar-ring focus:border-sidebar-ring focus:outline-none transition-all"
          value={language.name}
          onChange={(e) => onUpdate("languages", "name", e.target.value, language.id)}
          placeholder="Jazyk"
        />
        <select 
          className="p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground focus:ring-2 focus:ring-sidebar-ring focus:border-sidebar-ring focus:outline-none transition-all"
          value={language.level}
          onChange={(e) => onUpdate("languages", "level", e.target.value, language.id)}
        >
          <option value="">Vyberte úroveň</option>
          {LANGUAGE_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
        onClick={() => onRemove("languages", language.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function LanguagesForm({ items, onUpdate, onAdd, onRemove, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      onReorder("languages", oldIndex, newIndex);
    }
  };

  return (
    <div className="space-y-3">
      <Button 
        onClick={() => onAdd("languages")}
        className="w-full"
        variant="outline"
      >
        + Přidat jazyk
      </Button>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((language) => (
            <SortableLanguageItem
              key={language.id}
              language={language}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </SortableContext>
      </DndContext>
      
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-8 border border-dashed rounded">
          Zatím nemáte přidané žádné jazyky
        </div>
      )}
    </div>
  );
}
