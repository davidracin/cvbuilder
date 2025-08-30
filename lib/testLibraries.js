// Test script to verify libraries are working

export const testLibraries = async () => {
  console.log('Testing PDF export libraries...');
  
  try {
    // Test html2canvas import
    const html2canvas = await import('html2canvas-pro');
    console.log('✅ html2canvas-pro imported successfully');
    
    // Test jsPDF import
    const jsPDF = await import('jspdf');
    console.log('✅ jsPDF imported successfully');
    
    // Create a simple test element
    const testDiv = document.createElement('div');
    testDiv.style.width = '200px';
    testDiv.style.height = '100px';
    testDiv.style.backgroundColor = 'red';
    testDiv.style.color = 'white';
    testDiv.style.padding = '20px';
    testDiv.innerHTML = 'Test Content';
    testDiv.style.position = 'absolute';
    testDiv.style.top = '-1000px'; // Hide it
    
    document.body.appendChild(testDiv);
    
    // Test html2canvas
    console.log('Testing html2canvas...');
    const canvas = await html2canvas.default(testDiv, {
      backgroundColor: '#ffffff',
      scale: 1,
      logging: true
    });
    
    console.log('Canvas created:', { width: canvas.width, height: canvas.height });
    
    // Test PDF creation
    console.log('Testing PDF creation...');
    const pdf = new jsPDF.jsPDF();
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 10, 10, 50, 25);
    
    console.log('✅ PDF test successful');
    
    // Clean up
    document.body.removeChild(testDiv);
    
    return true;
  } catch (error) {
    console.error('❌ Library test failed:', error);
    return false;
  }
};
