import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

console.log('PDF Export module loaded');
console.log('html2canvas:', typeof html2canvas);
console.log('jsPDF:', typeof jsPDF);

/**
 * Export CV to PDF
 * @param {HTMLElement} element - The DOM element containing the CV
 * @param {string} filename - The filename for the exported PDF
 * @param {Object} options - Configuration options
 */
export const exportToPDF = async (element, filename = 'cv.pdf', options = {}) => {
  const {
    scale = 1.5,
    useCORS = true,
    allowTaint = true,
    backgroundColor = '#ffffff',
    width = 210, // A4 width in mm
    height = 297, // A4 height in mm
    quality = 0.95
  } = options;

  console.log('🚀 Starting main PDF export...');

  // Dynamic import to ensure libraries are loaded properly
  let html2canvas, jsPDF;
  
  try {
    const html2canvasModule = await import('html2canvas-pro');
    html2canvas = html2canvasModule.default;
    
    const jsPDFModule = await import('jspdf');
    jsPDF = jsPDFModule.jsPDF;
    
    console.log('✅ Libraries loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load libraries:', error);
    throw new Error('Failed to load PDF libraries');
  }

  try {
    // Show loading state
    const loadingElement = document.createElement('div');
    loadingElement.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; align-items: center; justify-content: center; color: white; font-family: sans-serif;">
        <div style="text-align: center;">
          <div style="margin-bottom: 10px;">Generování PDF...</div>
          <div style="width: 50px; height: 50px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
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

    // Wait for any pending renders
    await new Promise(resolve => setTimeout(resolve, 500));

    // Configure canvas options (simplified like the working version)
    const canvasOptions = {
      scale,
      useCORS,
      allowTaint,
      backgroundColor,
      scrollX: 0,
      scrollY: 0,
      logging: true,
      width: element.scrollWidth || element.offsetWidth,
      height: element.scrollHeight || element.offsetHeight
    };

    console.log('📸 Capturing element with options:', canvasOptions);

    // Create canvas from the element
    const canvas = await html2canvas(element, canvasOptions);
    
    console.log('✅ Canvas created:', {
      width: canvas.width,
      height: canvas.height
    });
    
    // Check if canvas is empty
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas is empty - no content was captured');
    }

    // Calculate dimensions (using same approach as simple export)
    const pageWidth = width;
    const pageHeight = height;
    const margin = 10;
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);
    
    const imgWidth = maxWidth;
    const imgHeight = (canvas.height * maxWidth) / canvas.width;
    
    // Create PDF
    console.log('📄 Creating PDF...');
    const pdf = new jsPDF({
      orientation: imgHeight > maxHeight ? 'portrait' : 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Convert canvas to image
    const imgData = canvas.toDataURL('image/jpeg', quality);
    
    // Add image to PDF (simplified approach)
    if (imgHeight <= maxHeight) {
      // Fits on one page
      pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
    } else {
      // Multiple pages needed (using same approach as simple export)
      let position = 0;
      while (position < imgHeight) {
        if (position > 0) {
          pdf.addPage();
        }
        
        const pageImgHeight = Math.min(maxHeight, imgHeight - position);
        
        // Create temp canvas for this page
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        const sourceY = (position * canvas.height) / imgHeight;
        const sourceHeight = (pageImgHeight * canvas.height) / imgHeight;
        
        tempCanvas.width = canvas.width;
        tempCanvas.height = sourceHeight;
        
        tempCtx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight,
          0, 0, canvas.width, sourceHeight
        );
        
        const pageImgData = tempCanvas.toDataURL('image/jpeg', quality);
        pdf.addImage(pageImgData, 'JPEG', margin, margin, imgWidth, pageImgHeight);
        
        position += maxHeight;
      }
    }

    // Save the PDF
    console.log('💾 Saving PDF...');
    pdf.save(filename);
    
    // Remove loading state
    document.body.removeChild(loadingElement);
    
    console.log('✅ PDF export successful!');
    return true;
  } catch (error) {
    // Remove loading state on error
    const loadingElement = document.querySelector('[style*="position: fixed"]');
    if (loadingElement) {
      document.body.removeChild(loadingElement);
    }
    
    console.error('❌ Error exporting PDF:', error);
    throw error;
  }
};

/**
 * Prepare element for PDF export by optimizing styles
 * @param {HTMLElement} element - The DOM element to prepare
 */
export const prepareElementForExport = (element) => {
  console.log('Preparing element for export:', element);
  
  // Add data attribute for identification
  element.setAttribute('data-cv-content', 'true');
  
  // Remove any shadows and borders that might cause double-page effect
  element.style.boxShadow = 'none';
  element.style.border = 'none';
  element.style.outline = 'none';
  
  // Ensure element is visible and has clean styling
  element.style.opacity = '1';
  element.style.visibility = 'visible';
  element.style.display = 'block';
  element.style.backgroundColor = '#ffffff';
  element.style.padding = '20px'; // Add some padding for better layout
  element.style.margin = '0';
  
  // Remove any transform or positioning that might cause issues
  element.style.transform = 'none';
  element.style.position = 'relative';
  
  console.log('Element prepared. Dimensions:', {
    offsetWidth: element.offsetWidth,
    offsetHeight: element.offsetHeight,
    scrollWidth: element.scrollWidth,
    scrollHeight: element.scrollHeight
  });
  
  return element;
};

/**
 * Export with better error handling and user feedback
 * @param {string} elementId - ID of the element to export
 * @param {string} filename - Name of the PDF file
 * @param {Object} options - Export options
 */
export const exportCVToPDF = async (elementId, filename = 'cv.pdf', options = {}) => {
  console.log('Starting PDF export for element:', elementId);
  
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    throw new Error('CV obsah nebyl nalezen. Zkuste obnovit stránku.');
  }
  
  console.log('Element found:', element);
  console.log('Element dimensions:', {
    width: element.offsetWidth,
    height: element.offsetHeight,
    scrollWidth: element.scrollWidth,
    scrollHeight: element.scrollHeight
  });
  
  // Check if element has content
  if (element.offsetWidth === 0 || element.offsetHeight === 0) {
    console.error('Element has no dimensions');
    throw new Error('CV obsah nemá žádné rozměry. Zkuste obnovit stránku.');
  }
  
  // Wait a moment for any pending renders
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Prepare element for export (minimal preparation)
  const preparedElement = prepareElementForExport(element);
  
  // Ensure filename has .pdf extension
  const pdfFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  
  console.log('Calling exportToPDF with:', { element: preparedElement, filename: pdfFilename, options });
  
  return await exportToPDF(preparedElement, pdfFilename, options);
};
