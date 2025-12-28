"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { exportToPDF } from "../../../lib/pdfExportNew";
import ExportButton from "../../../components/ExportButton";
import { useToast } from "../../../components/Toast";
import { useCVData } from "../../../hooks/useCVData";
import { useAuth } from "../../../hooks/useAuth";
import { createCV, updateCV, getCV } from "../../../lib/firestoreCVs";
import PersonalInfoForm from "../../../components/forms/PersonalInfoForm";
import ExperienceForm from "../../../components/forms/ExperienceForm";
import EducationForm from "../../../components/forms/EducationForm";
import SkillsForm from "../../../components/forms/SkillsForm";
import LanguagesForm from "../../../components/forms/LanguagesForm";
import CustomSectionsForm from "../../../components/forms/CustomSectionsForm";
import DesignTab from "../../../components/editor/DesignTab";
import ModerniCVTemplate from "../../../components/templates/ModerniCVTemplate";
import KlasickeTemplate from "../../../components/templates/KlasickeTemplate";
import KreativniTemplate from "../../../components/templates/KreativniTemplate";
import ProfesionalniTemplate from "../../../components/templates/ProfesionalniTemplate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function EditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateSlug = params.template;
  const { addToast, ToastContainer } = useToast();
  const { 
    cvData, 
    cvId, 
    cvName, 
    setCVName, 
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
    resetDesignSettings,
    getDesignSettings,
    loadCV 
  } = useCVData();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  // Load CV from URL parameter on mount
  useEffect(() => {
    const cvIdFromUrl = searchParams.get('cvId');
    if (cvIdFromUrl && user) {
      loadCVFromFirestore(cvIdFromUrl);
    }
  }, [searchParams, user]);

  const loadCVFromFirestore = async (id) => {
    const { cv, error } = await getCV(id);
    if (error) {
      addToast('Chyba při načítání CV', 'error');
      return;
    }
    if (cv && cv.userId === user.uid) {
      loadCV(cv.cvData, cv.id, cv.cvName);
    } else {
      addToast('Nemáte oprávnění k tomuto CV', 'error');
      router.push('/');
    }
  };

  const handleSave = async () => {
    if (!user) {
      addToast('Musíte být přihlášeni', 'error');
      router.push('/login');
      return;
    }

    setSaving(true);

    if (cvId) {
      // Update existing CV
      const { error } = await updateCV(cvId, cvData, cvName);
      if (error) {
        addToast('Chyba při ukládání', 'error');
      } else {
        addToast('CV uloženo', 'success');
      }
    } else {
      // Create new CV
      const { id, cvName: generatedName, error } = await createCV(
        user.uid,
        cvData,
        templateSlug,
        cvName || null
      );
      if (error) {
        addToast('Chyba při vytváření CV', 'error');
      } else {
        loadCV(cvData, id, generatedName);
        router.replace(`/editor/${templateSlug}?cvId=${id}`);
        addToast('CV vytvořeno', 'success');
      }
    }
    setSaving(false);
  };

  // Function to export CV to PDF
  const handleExportToPDF = async (filename) => {
    try {
      const success = await exportToPDF(cvData, templateSlug, filename, designSettings);
      
      if (success) {
        addToast('CV bylo úspěšně exportováno do PDF!', 'success');
        
        // Update lastExported timestamp if CV is saved
        if (cvId) {
          const { updateLastExported } = await import('../../../lib/firestoreCVs');
          await updateLastExported(cvId);
        }
      } else {
        addToast('Nepodařilo se exportovat CV. Zkuste to prosím znovu.', 'error');
      }
      
      return success;
    } catch (error) {
      console.error('Chyba při exportu:', error);
      addToast('Došlo k chybě při exportu PDF. Zkuste to prosím znovu.', 'error');
      return false;
    }
  };

  // Get design settings with template defaults
  const designSettings = getDesignSettings(templateSlug);

  // Handle design reset
  const handleResetDesign = () => {
    resetDesignSettings(templateSlug);
    addToast('Design resetován na výchozí nastavení', 'success');
  };

  // Render the appropriate template
  const renderTemplate = () => {
    const templateProps = {
      data: cvData,
      designSettings: designSettings
    };

    switch (templateSlug) {
      case "moderni":
        return <ModerniCVTemplate {...templateProps} />;
      case "klasicke":
        return <KlasickeTemplate {...templateProps} />;
      case "kreativni":
        return <KreativniTemplate {...templateProps} />;
      case "profesionalni":
        return <ProfesionalniTemplate {...templateProps} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-500">Šablona nebyla nalezena</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for editing */}
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
                onClick={handleSave}
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
              onExport={handleExportToPDF}
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
              onResetDesignSettings={handleResetDesign}
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

      {/* Preview area */}
      <div className="w-2/3 overflow-y-auto p-6 bg-gray-100 flex flex-col items-center">
        <div 
          className="w-full max-w-3xl shadow-lg min-h-[500px] p-8"
          style={{
            backgroundColor: designSettings.colors.background,
            minWidth: '800px',
            minHeight: '1000px',
            border: '1px solid #e5e7eb',
            position: 'relative'
          }}
        >
          {/* CV Content - this is what gets exported */}
          <div 
            id="cv-preview"
            style={{
              padding: '0',
              margin: '0',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
