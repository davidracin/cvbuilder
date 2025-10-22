"use client";
import { useParams } from "next/navigation";
import { exportCVToPDF } from "../../../lib/pdfExport";
import ExportButton from "../../../components/ExportButton";
import { useToast } from "../../../components/Toast";
import { useCVData } from "../../../hooks/useCVData";
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
  const templateSlug = params.template;
  const { addToast, ToastContainer } = useToast();
  const { cvData, updateCvData, addItem, removeItem } = useCVData();

  // Function to export CV to PDF
  const handleExportToPDF = async (filename) => {
    try {
      const exportFilename = filename || `${cvData.personal.name.replace(/\s+/g, '_')}_CV.pdf`;
      const success = await exportCVToPDF('cv-preview', exportFilename, {
        scale: 2,
        quality: 0.95,
        backgroundColor: '#ffffff',
        width: 210, // A4 width in mm
        height: 297 // A4 height in mm
      });
      
      if (success) {
        addToast('CV bylo úspěšně exportováno do PDF!', 'success');
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
