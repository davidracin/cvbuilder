/**
 * Simple, guaranteed-to-work PDF export
 * This is a minimal implementation to test if the basic functionality works
 */

export const simpleExportToPDF = async (elementId) => {
  console.log('🚀 Starting simple PDF export...');
  
  // Step 1: Dynamic import to ensure libraries are loaded
  let html2canvas, jsPDF;
  
  try {
    const html2canvasModule = await import('html2canvas-pro');
    html2canvas = html2canvasModule.default;
    console.log('✅ html2canvas-pro loaded');
    
    const jsPDFModule = await import('jspdf');
    jsPDF = jsPDFModule.jsPDF;
    console.log('✅ jsPDF loaded');
  } catch (error) {
    console.error('❌ Failed to load libraries:', error);
    alert('Nepodařilo se načíst knihovny pro export. Zkuste obnovit stránku.');
    return false;
  }
  
  // Step 2: Find and validate element
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('❌ Element not found:', elementId);
    alert('CV obsah nebyl nalezen.');
    return false;
  }
  
  console.log('✅ Element found:', element);
  console.log('Element dimensions:', {
    offsetWidth: element.offsetWidth,
    offsetHeight: element.offsetHeight,
    clientWidth: element.clientWidth,
    clientHeight: element.clientHeight
  });
  
  // Step 3: Show loading
  const loader = document.createElement('div');
  loader.innerHTML = `
    <div style="
      position: fixed; 
      top: 0; left: 0; 
      width: 100%; height: 100%; 
      background: rgba(0,0,0,0.8); 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      z-index: 10000;
      color: white;
      font-family: Arial, sans-serif;
      font-size: 18px;
    ">
      Generování PDF... Prosím čekejte.
    </div>
  `;
  document.body.appendChild(loader);
  
  try {
    // Step 4: Wait a moment for any renders to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 4.5: Clean up element styling to remove shadows
    const originalStyle = {
      boxShadow: element.style.boxShadow,
      border: element.style.border,
      padding: element.style.padding
    };
    
    // Remove shadows and borders temporarily
    element.style.boxShadow = 'none';
    element.style.border = 'none';
    element.style.padding = '20px';
    
    // Step 5: Capture with minimal options
    console.log('📸 Capturing element...');
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      logging: true,
      width: element.scrollWidth || element.offsetWidth,
      height: element.scrollHeight || element.offsetHeight,
      scrollX: 0,
      scrollY: 0
    });
    
    console.log('✅ Canvas captured:', {
      width: canvas.width,
      height: canvas.height
    });
    
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas je prázdný');
    }
    
    // Step 6: Create PDF
    console.log('📄 Creating PDF...');
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    
    // Calculate dimensions to fit A4
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 10;
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);
    
    // Scale image to fit page
    const imgWidth = maxWidth;
    const imgHeight = (canvas.height * maxWidth) / canvas.width;
    
    // Convert canvas to image
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    if (imgHeight <= maxHeight) {
      // Fits on one page
      pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
    } else {
      // Multiple pages needed
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
        
        const pageImgData = tempCanvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(pageImgData, 'JPEG', margin, margin, imgWidth, pageImgHeight);
        
        position += maxHeight;
      }
    }
    
    // Step 7: Save PDF
    console.log('💾 Saving PDF...');
    pdf.save('cv-simple-export.pdf');
    
    console.log('✅ PDF export successful!');
    alert('PDF bylo úspěšně vyexportováno!');
    
    // Restore original styles
    element.style.boxShadow = originalStyle.boxShadow;
    element.style.border = originalStyle.border;
    element.style.padding = originalStyle.padding;
    
    return true;
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    alert(`Chyba při exportu: ${error.message}`);
    return false;
  } finally {
    // Remove loader
    if (loader && loader.parentNode) {
      document.body.removeChild(loader);
    }
  }
};
