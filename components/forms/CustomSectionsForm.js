"use client"

import { useState } from "react";
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
import { GripVertical, X, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { MonthYearPicker } from "@/components/ui/date-picker";
import { isoToDate, dateToISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CUSTOM_SECTION_TYPES } from "@/lib/constants";

function SortableCustomSectionItem({ item, sectionId, onUpdateItem, onRemoveItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleStartDateChange = (date) => {
    const isoDate = date ? dateToISO(date) : "";
    onUpdateItem(sectionId, item.id, "startDate", isoDate);
  };

  const handleEndDateChange = (dateOrSentinel) => {
    if (dateOrSentinel === "current") {
      onUpdateItem(sectionId, item.id, "endDate", "current");
    } else {
      const isoDate = dateOrSentinel ? dateToISO(dateOrSentinel) : "";
      onUpdateItem(sectionId, item.id, "endDate", isoDate);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-2 p-3 border border-sidebar-border rounded bg-sidebar/30"
    >
      <div className="flex items-start gap-2">
        <button
          className="cursor-grab active:cursor-grabbing mt-2 text-muted-foreground hover:text-foreground transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <h5 className="text-xs font-medium text-muted-foreground">
              {item.title || "Nová položka"}
            </h5>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-destructive hover:text-destructive"
              onClick={() => onRemoveItem(sectionId, item.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <input 
            type="text" 
            className="w-full p-2 text-sm border rounded bg-sidebar-accent text-sidebar-accent-foreground focus:ring-2 focus:ring-sidebar-ring focus:outline-none transition-all"
            value={item.title}
            onChange={(e) => onUpdateItem(sectionId, item.id, "title", e.target.value)}
            placeholder="Název"
          />
          
          <input 
            type="text" 
            className="w-full p-2 text-sm border rounded bg-sidebar-accent text-sidebar-accent-foreground focus:ring-2 focus:ring-sidebar-ring focus:outline-none transition-all"
            value={item.subTitle}
            onChange={(e) => onUpdateItem(sectionId, item.id, "subTitle", e.target.value)}
            placeholder="Titulek"
          />
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <MonthYearPicker
                date={isoToDate(item.startDate)}
                onDateChange={handleStartDateChange}
                placeholder="Od"
                allowCurrent={false}
                className="text-sm"
              />
            </div>
            <div>
              <MonthYearPicker
                date={item.endDate === "current" ? undefined : isoToDate(item.endDate)}
                isCurrent={item.endDate === "current"}
                onDateChange={handleEndDateChange}
                placeholder="Do"
                allowCurrent={true}
                className="text-sm"
              />
            </div>
          </div>
          
          <textarea 
            className="w-full p-2 text-sm border rounded bg-sidebar-accent text-sidebar-accent-foreground focus:ring-2 focus:ring-sidebar-ring focus:border-sidebar-ring focus:outline-none transition-all min-h-[60px] resize-y"
            value={item.description}
            onChange={(e) => onUpdateItem(sectionId, item.id, "description", e.target.value)}
            placeholder="Popis..."
          />
        </div>
      </div>
    </div>
  );
}

function CustomSection({ 
  section, 
  onUpdateSection, 
  onRemoveSection, 
  onAddItem, 
  onUpdateItem, 
  onRemoveItem,
  onReorderItems 
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = section.items.findIndex((item) => item.id === active.id);
      const newIndex = section.items.findIndex((item) => item.id === over.id);
      
      onReorderItems(section.id, oldIndex, newIndex);
    }
  };

  const sectionTypeData = CUSTOM_SECTION_TYPES[section.type] || CUSTOM_SECTION_TYPES.custom;

  return (
    <div className="mb-3 p-3 border-2 border-sidebar-border rounded bg-sidebar/20">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{sectionTypeData.icon}</span>
            <input 
              type="text" 
              className="flex-1 p-1.5 text-sm font-medium border rounded bg-sidebar-accent text-sidebar-accent-foreground focus:ring-2 focus:ring-sidebar-ring focus:border-sidebar-ring focus:outline-none transition-all"
              value={section.title}
              onChange={(e) => onUpdateSection(section.id, "title", e.target.value)}
              placeholder="Název sekce"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => onRemoveSection(section.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-2">
          <Button
            onClick={() => onAddItem(section.id)}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Plus className="h-3 w-3 mr-1" />
            Přidat položku
          </Button>

          {section.items && section.items.length > 0 && (
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={section.items.map(item => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {section.items.map((item) => (
                  <SortableCustomSectionItem
                    key={item.id}
                    item={item}
                    sectionId={section.id}
                    onUpdateItem={onUpdateItem}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {(!section.items || section.items.length === 0) && (
            <div className="text-center text-xs text-muted-foreground py-4 border border-dashed rounded">
              Žádné položky
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CustomSectionsForm({ 
  sections, 
  onAddSection,
  onUpdateSection,
  onRemoveSection,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onReorderItems
}) {
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const handleAddSection = (type) => {
    const sectionData = CUSTOM_SECTION_TYPES[type];
    onAddSection(type, sectionData.title);
    setShowTypeSelector(false);
  };

  return (
    <div className="space-y-3">
      {!showTypeSelector ? (
        <Button 
          onClick={() => setShowTypeSelector(true)}
          className="w-full"
          variant="outline"
        >
          + Přidat vlastní sekci
        </Button>
      ) : (
        <div className="space-y-2 p-3 border rounded bg-sidebar-accent/50">
          <p className="text-sm font-medium mb-2">Vyberte typ sekce:</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(CUSTOM_SECTION_TYPES).map((type) => (
              <Button
                key={type.type}
                onClick={() => handleAddSection(type.type)}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                <span className="mr-2">{type.icon}</span>
                {type.title}
              </Button>
            ))}
          </div>
          <Button
            onClick={() => setShowTypeSelector(false)}
            variant="ghost"
            size="sm"
            className="w-full mt-2"
          >
            Zrušit
          </Button>
        </div>
      )}

      {sections && sections.map((section) => (
        <CustomSection
          key={section.id}
          section={section}
          onUpdateSection={onUpdateSection}
          onRemoveSection={onRemoveSection}
          onAddItem={onAddItem}
          onUpdateItem={onUpdateItem}
          onRemoveItem={onRemoveItem}
          onReorderItems={onReorderItems}
        />
      ))}

      {(!sections || sections.length === 0) && !showTypeSelector && (
        <div className="text-center text-sm text-muted-foreground py-8 border border-dashed rounded">
          Zatím nemáte přidané žádné vlastní sekce
        </div>
      )}
    </div>
  );
}
