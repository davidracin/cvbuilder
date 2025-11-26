"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { exportCVToPDF } from "../../../lib/pdfExport";
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
import ModerniCVTemplate from "../../../components/templates/ModerniCVTemplate";
import KlasickeTemplate from "../../../components/templates/KlasickeTemplate";
import KreativniTemplate from "../../../components/templates/KreativniTemplate";
import ProfesionalniTemplate from "../../../components/templates/ProfesionalniTemplate";

export default function EditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateSlug = params.template;
  const { addToast, ToastContainer } = useToast();
  const { cvData, cvId, cvName, setCVName, updateCvData, addItem, removeItem, loadCV } = useCVData();
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
      const exportFilename = filename || `${cvData.personal.name.replace(/\s+/g, '_')}_CV.pdf`;
      const success = await exportCVToPDF('cv-preview', exportFilename, {
        scale: 3, // Higher resolution for better quality
        quality: 1.0, // Maximum quality
        imageFormat: 'PNG', // PNG for sharper text and colors
        backgroundColor: '#ffffff',
        width: 210, // A4 width in mm
        height: 297 // A4 height in mm
      });
      
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

  // Render the appropriate template
  const renderTemplate = () => {
    switch (templateSlug) {
      case "moderni":
        return <ModerniCVTemplate data={cvData} />;
      case "klasicke":
        return <KlasickeTemplate data={cvData} />;
      case "kreativni":
        return <KreativniTemplate data={cvData} />;
      case "profesionalni":
        return <ProfesionalniTemplate data={cvData} />;
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
          <h1 className="text-xl font-bold mb-3">Editor CV - {templateSlug}</h1>
          
          {/* CV Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Název CV</label>
            <input
              type="text"
              value={cvName}
              onChange={(e) => setCVName(e.target.value)}
              placeholder="Zadejte název vašeho CV"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Ukládání...' : cvId ? 'Uložit změny' : 'Uložit CV'}
          </button>
          
          {/* Export Button */}
          <ExportButton 
            onExport={handleExportToPDF}
            filename={`${cvData.personal.name.replace(/\s+/g, '_')}_CV.pdf`}
          />
        </div>
        
        {/* Personal Information Section */}
        <PersonalInfoForm 
          data={cvData.personal} 
          onUpdate={updateCvData} 
        />
        
        {/* Work Experience Section */}
        <ExperienceForm 
          items={cvData.experience}
          onUpdate={updateCvData}
          onAdd={addItem}
          onRemove={removeItem}
        />
        
        {/* Education Section */}
        <EducationForm 
          items={cvData.education}
          onUpdate={updateCvData}
          onAdd={addItem}
          onRemove={removeItem}
        />
        
        {/* Skills Section */}
        <SkillsForm 
          items={cvData.skills}
          onUpdate={updateCvData}
          onAdd={addItem}
          onRemove={removeItem}
        />
        
        {/* Languages Section */}
        <LanguagesForm 
          items={cvData.languages}
          onUpdate={updateCvData}
          onAdd={addItem}
          onRemove={removeItem}
        />
      </div>

      {/* Preview area */}
      <div className="w-2/3 overflow-y-auto p-6 bg-white flex flex-col items-center">
        <div 
          className="w-full max-w-3xl shadow-lg min-h-[500px] p-8 bg-white"
          style={{
            backgroundColor: '#ffffff',
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
              backgroundColor: '#ffffff',
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
