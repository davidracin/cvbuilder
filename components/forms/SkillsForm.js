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

function SortableSkillItem({ skill, onUpdate, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id });

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
      
      <input 
        type="text" 
        className="flex-1 p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground focus:ring-2 focus:ring-sidebar-ring focus:border-sidebar-ring focus:outline-none transition-all"
        value={skill.name}
        onChange={(e) => onUpdate("skills", "name", e.target.value, skill.id)}
        placeholder="Název dovednosti"
      />
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
        onClick={() => onRemove("skills", skill.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function SkillsForm({ items, onUpdate, onAdd, onRemove, onReorder }) {
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
      
      onReorder("skills", oldIndex, newIndex);
    }
  };

  return (
    <div className="space-y-3">
      <Button 
        onClick={() => onAdd("skills")}
        className="w-full"
        variant="outline"
      >
        + Přidat dovednost
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
          {items.map((skill) => (
            <SortableSkillItem
              key={skill.id}
              skill={skill}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </SortableContext>
      </DndContext>
      
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-8 border border-dashed rounded">
          Zatím nemáte přidané žádné dovednosti
        </div>
      )}
    </div>
  );
}
