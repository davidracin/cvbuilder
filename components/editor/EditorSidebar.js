"use client";
import { memo } from "react";
import ExportButton from "../ExportButton";
import PersonalInfoForm from "../forms/PersonalInfoForm";
import ExperienceForm from "../forms/ExperienceForm";
import EducationForm from "../forms/EducationForm";
import SkillsForm from "../forms/SkillsForm";
import LanguagesForm from "../forms/LanguagesForm";
import CustomSectionsForm from "../forms/CustomSectionsForm";
import DesignTab from "./DesignTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function EditorSidebar({
  // CV metadata
  cvName,
  setCVName,
  cvId,
  templateSlug,
  // Auth & state
  user,
  saving,
  // Actions
  onSave,
  onExport,
  onResetDesign,
  // CV data
  cvData,
  designSettings,
  // CV data handlers
  updateCvData,
  addItem,
  removeItem,
  reorderItems,
  addCustomSection,
  updateCustomSection,
  removeCustomSection,
  addCustomSectionItem,
  updateCustomSectionItem,
  removeCustomSectionItem,
  reorderCustomSectionItems,
  updateDesignSettings,
}) {
  return (
    <div className="w-1/3 bg-sidebar text-sidebar-foreground overflow-y-auto p-4 border-r border-sidebar-border">
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-3">Editor CV</h1>
        
        {/* CV Name Input */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1.5">Název CV</label>
          <input
            type="text"
            value={cvName}
            onChange={(e) => setCVName(e.target.value)}
            placeholder="Zadejte název vašeho CV"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:border-sidebar-ring bg-sidebar-accent text-sidebar-accent-foreground"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          {user ? (
            <button
              onClick={onSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-sidebar-primary text-sidebar-primary-foreground rounded-md hover:bg-sidebar-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {saving ? 'Ukládání...' : cvId ? 'Uložit' : 'Vytvořit'}
            </button>
          ) : (
            <div className="flex-1 px-4 py-2 bg-gray-300 text-gray-500 rounded-md text-sm font-medium text-center cursor-not-allowed">
              Přihlaste se pro uložení
            </div>
          )}
          
          {/* Export Button */}
          <ExportButton 
            onExport={onExport}
            filename={`${cvName || templateSlug}_CV.pdf`}
          />
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="content">Obsah</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="information">Informace</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-2">
          <Accordion type="single" collapsible defaultValue="personal" className="w-full">
            <AccordionItem value="personal">
              <AccordionTrigger className="text-sm font-semibold">
                Osobní údaje
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <PersonalInfoForm 
                  data={cvData.personal} 
                  onUpdate={updateCvData} 
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="experience">
              <AccordionTrigger className="text-sm font-semibold">
                Pracovní zkušenosti
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <ExperienceForm 
                  items={cvData.experience}
                  onUpdate={updateCvData}
                  onAdd={addItem}
                  onRemove={removeItem}
                  onReorder={reorderItems}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="education">
              <AccordionTrigger className="text-sm font-semibold">
                Vzdělání
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <EducationForm 
                  items={cvData.education}
                  onUpdate={updateCvData}
                  onAdd={addItem}
                  onRemove={removeItem}
                  onReorder={reorderItems}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="skills">
              <AccordionTrigger className="text-sm font-semibold">
                Dovednosti
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <SkillsForm 
                  items={cvData.skills}
                  onUpdate={updateCvData}
                  onAdd={addItem}
                  onRemove={removeItem}
                  onReorder={reorderItems}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="languages">
              <AccordionTrigger className="text-sm font-semibold">
                Jazyky
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <LanguagesForm 
                  items={cvData.languages}
                  onUpdate={updateCvData}
                  onAdd={addItem}
                  onRemove={removeItem}
                  onReorder={reorderItems}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="custom">
              <AccordionTrigger className="text-sm font-semibold">
                Vlastní sekce
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <CustomSectionsForm 
                  sections={cvData.customSections}
                  onAddSection={addCustomSection}
                  onUpdateSection={updateCustomSection}
                  onRemoveSection={removeCustomSection}
                  onAddItem={addCustomSectionItem}
                  onUpdateItem={updateCustomSectionItem}
                  onRemoveItem={removeCustomSectionItem}
                  onReorderItems={reorderCustomSectionItems}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        {/* Design Tab */}
        <TabsContent value="design">
          <DesignTab
            designSettings={designSettings}
            onUpdateDesignSettings={updateDesignSettings}
            onResetDesignSettings={onResetDesign}
            templateName={templateSlug}
          />
        </TabsContent>

        {/* Information Tab */}
        <TabsContent value="information" className="space-y-4">
          <div className="p-4 border rounded bg-sidebar-accent/50">
            <h3 className="font-semibold mb-2">Informace o CV</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Šablona:</span>
                <span className="font-medium text-foreground capitalize">{templateSlug}</span>
              </div>
              <div className="flex justify-between">
                <span>Stav:</span>
                <span className="font-medium text-foreground">{cvId ? 'Uloženo' : 'Neuloženo'}</span>
              </div>
              {cvId && (
                <div className="flex justify-between">
                  <span>ID:</span>
                  <span className="font-mono text-xs text-foreground">{cvId}</span>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default memo(EditorSidebar);
