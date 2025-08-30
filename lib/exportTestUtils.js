/**
 * Test utility for PDF export functionality
 * This file provides testing functions to verify PDF export works correctly
 */

export const testPDFExport = () => {
  console.log('Testing PDF Export functionality...');
  
  // Check if required libraries are loaded
  const tests = [
    {
      name: 'html2canvas-pro availability',
      test: () => typeof window !== 'undefined' && window.html2canvas !== undefined,
      message: 'html2canvas-pro library is loaded'
    },
    {
      name: 'jsPDF availability', 
      test: () => typeof window !== 'undefined' && window.jspdf !== undefined,
      message: 'jsPDF library is loaded'
    },
    {
      name: 'CV preview element',
      test: () => document.getElementById('cv-preview') !== null,
      message: 'CV preview element found in DOM'
    },
    {
      name: 'Export function',
      test: () => typeof exportCVToPDF === 'function',
      message: 'Export function is available'
    }
  ];
  
  tests.forEach(test => {
    try {
      const result = test.test();
      console.log(`✅ ${test.name}: ${result ? 'PASS' : 'FAIL'} - ${test.message}`);
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
    }
  });
};

export const logExportAttempt = (filename, options) => {
  console.log('PDF Export Attempt:', {
    filename,
    options,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });
};

export const logExportResult = (success, error = null) => {
  if (success) {
    console.log('✅ PDF Export successful');
  } else {
    console.log('❌ PDF Export failed:', error);
  }
};
