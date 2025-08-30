import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

/**
 * Simple debug version of PDF export with extensive logging
 */
export const debugPDFExport = async (elementId) => {
  console.log('=== DEBUG PDF EXPORT START ===');
  
  // Step 1: Find element
  console.log('1. Finding element with ID:', elementId);
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error('❌ Element not found!');
    return false;
  }
  
  console.log('✅ Element found:', element);
  
  // Step 2: Check element properties
  const rect = element.getBoundingClientRect();
  const styles = window.getComputedStyle(element);
  
  console.log('2. Element properties:', {
    offsetWidth: element.offsetWidth,
    offsetHeight: element.offsetHeight,
    scrollWidth: element.scrollWidth,
    scrollHeight: element.scrollHeight,
    clientWidth: element.clientWidth,
    clientHeight: element.clientHeight,
    boundingRect: rect,
    display: styles.display,
    visibility: styles.visibility,
    opacity: styles.opacity,
    position: styles.position
  });
  
  // Step 3: Check if element has visible content
  const hasContent = element.innerHTML.trim().length > 0;
  const hasVisibleContent = rect.width > 0 && rect.height > 0;
  
  console.log('3. Content check:', {
    hasContent,
    hasVisibleContent,
    contentLength: element.innerHTML.length
  });
  
  if (!hasVisibleContent) {
    console.error('❌ Element has no visible content!');
    return false;
  }
  
  // Step 4: Simple html2canvas test
  console.log('4. Testing html2canvas...');
  
  try {
    const canvas = await html2canvas(element, {
      scale: 1,
      logging: true,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.offsetWidth,
      height: element.offsetHeight
    });
    
    console.log('✅ Canvas created:', {
      width: canvas.width,
      height: canvas.height,
      dataUrl: canvas.toDataURL().substring(0, 50) + '...'
    });
    
    // Step 5: Test PDF creation
    console.log('5. Creating PDF...');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    
    console.log('✅ PDF created, saving...');
    pdf.save('debug-test.pdf');
    
    console.log('=== DEBUG PDF EXPORT SUCCESS ===');
    return true;
    
  } catch (error) {
    console.error('❌ Error during export:', error);
    console.log('=== DEBUG PDF EXPORT FAILED ===');
    return false;
  }
};
