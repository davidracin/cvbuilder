import React from 'react';

/**
 * Export Button Component with loading state and better UX
 */
export default function ExportButton({ 
  onExport, 
  disabled = false, 
  filename = 'cv.pdf',
  className = '' 
}) {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    if (isExporting || disabled) return;
    
    setIsExporting(true);
    try {
      await onExport(filename);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button 
      onClick={handleExport}
      disabled={disabled || isExporting}
      className={`
        w-full px-4 py-2 font-medium rounded-lg shadow-sm transition-colors duration-200 
        flex items-center justify-center gap-2 relative overflow-hidden
        ${isExporting 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {isExporting ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Exportuje se...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportovat do PDF
        </>
      )}
    </button>
  );
}
