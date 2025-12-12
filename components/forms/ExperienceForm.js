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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from "lucide-react";
import { MonthYearPicker } from "@/components/ui/date-picker";
import { isoToDate, dateToISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function SortableExperienceItem({ exp, onUpdate, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exp.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleStartDateChange = (date) => {
    const isoDate = date ? dateToISO(date) : "";
    onUpdate("experience", "startDate", isoDate, exp.id);
  };

  const handleEndDateChange = (date) => {
    const isoDate = date ? dateToISO(date) : "";
    onUpdate("experience", "endDate", isoDate, exp.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-3 p-3 border border-sidebar-border rounded bg-sidebar/50"
    >
      <div className="flex items-start gap-2 mb-3">
        <button
          className="cursor-grab active:cursor-grabbing mt-2 text-muted-foreground hover:text-foreground transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
        
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-sm">
              {exp.title || "Nová pozice"} - {exp.company || "Společnost"}
            </h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:text-destructive"
              onClick={() => onRemove("experience", exp.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Pozice</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground focus:ring-2 focus:ring-sidebar-ring focus:border-sidebar-ring focus:outline-none transition-all"
              value={exp.title}
              onChange={(e) => onUpdate("experience", "title", e.target.value, exp.id)}
              placeholder="Název pozice"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Společnost</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground focus:ring-2 focus:ring-sidebar-ring focus:border-sidebar-ring focus:outline-none transition-all"
              value={exp.company}
              onChange={(e) => onUpdate("experience", "company", e.target.value, exp.id)}
              placeholder="Název společnosti"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1.5">Od</label>
              <MonthYearPicker
                date={isoToDate(exp.startDate)}
                onDateChange={handleStartDateChange}
                placeholder="Měsíc/Rok"
                allowCurrent={false}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Do</label>
              <MonthYearPicker
                date={isoToDate(exp.endDate)}
                onDateChange={handleEndDateChange}
                placeholder="Současnost"
                allowCurrent={true}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Popis</label>
            <textarea 
              className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground focus:ring-2 focus:ring-sidebar-ring focus:border-sidebar-ring focus:outline-none transition-all min-h-[80px] resize-y"
              value={exp.description}
              onChange={(e) => onUpdate("experience", "description", e.target.value, exp.id)}
              placeholder="Popište vaši pracovní náplň a dosažené úspěchy..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExperienceForm({ items, onUpdate, onAdd, onRemove, onReorder }) {
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
      
      onReorder("experience", oldIndex, newIndex);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Button 
          onClick={() => onAdd("experience")}
          className="w-full"
          variant="outline"
        >
          + Přidat pracovní zkušenost
        </Button>
      </div>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((exp) => (
            <SortableExperienceItem
              key={exp.id}
              exp={exp}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </SortableContext>
      </DndContext>
      
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-8 border border-dashed rounded">
          Zatím nemáte přidané žádné pracovní zkušenosti
        </div>
      )}
    </div>
  );
}
