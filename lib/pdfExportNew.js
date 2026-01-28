import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

// Import PDF templates
import KlasickeTemplatePDF from '@/components/templates/pdf/KlasickeTemplatePDF';
import ModerniTemplatePDF from '@/components/templates/pdf/ModerniTemplatePDF';
import KreativniTemplatePDF from '@/components/templates/pdf/KreativniTemplatePDF';
import ProfesionalniTemplatePDF from '@/components/templates/pdf/ProfesionalniTemplatePDF';

// Import font registration (side effect)
import '@/lib/pdfFonts';
import { TEMPLATE_DESIGN_DEFAULTS } from '@/lib/constants';

// Template mapping
const PDF_TEMPLATES = {
  klasicke: KlasickeTemplatePDF,
  moderni: ModerniTemplatePDF,
  kreativni: KreativniTemplatePDF,
  profesionalni: ProfesionalniTemplatePDF,
};

// Default design settings - use constants as single source of truth
const DEFAULT_DESIGN_SETTINGS = TEMPLATE_DESIGN_DEFAULTS;

/**
 * Export CV to PDF using @react-pdf/renderer
 * @param {Object} cvData - The CV data object
 * @param {string} templateName - The template name (klasicke, moderni, kreativni, profesionalni)
 * @param {string} filename - The filename for the exported PDF
 * @param {Object} designSettings - Optional design settings override
 * @returns {Promise<boolean>} - Returns true on success
 */
export const exportToPDF = async (cvData, templateName, filename = 'cv.pdf', designSettings = null) => {
  // Get the PDF template component
  const TemplateComponent = PDF_TEMPLATES[templateName];
  
  if (!TemplateComponent) {
    throw new Error(`Unknown template: ${templateName}. Available templates: ${Object.keys(PDF_TEMPLATES).join(', ')}`);
  }

  // Use provided design settings or fall back to defaults
  const finalDesignSettings = designSettings || cvData.designSettings || DEFAULT_DESIGN_SETTINGS[templateName];

  // Show loading state
  const loadingElement = document.createElement('div');
  loadingElement.id = 'pdf-loading-overlay';
  loadingElement.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; align-items: center; justify-content: center; color: white; font-family: sans-serif;">
      <div style="text-align: center;">
        <div style="margin-bottom: 10px;">Generování PDF...</div>
        <div style="width: 50px; height: 50px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </div>
  `;
  document.body.appendChild(loadingElement);

  try {
    // Create the PDF document element
    const pdfDocument = TemplateComponent({ 
      data: cvData, 
      designSettings: finalDesignSettings 
    });

    // Generate PDF blob
    const blob = await pdf(pdfDocument).toBlob();

    // Save the PDF using file-saver
    saveAs(blob, filename);

    // Remove loading state
    const overlay = document.getElementById('pdf-loading-overlay');
    if (overlay) {
      document.body.removeChild(overlay);
    }

    return true;
  } catch (error) {
    // Remove loading state on error
    const overlay = document.getElementById('pdf-loading-overlay');
    if (overlay) {
      document.body.removeChild(overlay);
    }

    throw error;
  }
};
