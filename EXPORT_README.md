# CV Builder - Export to PDF Feature

## Overview

This CV Builder application now includes a PDF export functionality that allows users to download their CV as a high-quality PDF file.

## Features

### PDF Export Capabilities
- **High-Quality Output**: Uses html2canvas-pro for better color support and rendering
- **A4 Format**: Automatically formats the CV to fit A4 page size (210mm x 297mm)
- **Multiple Pages**: Automatically handles content that spans multiple pages
- **Color Optimization**: Converts OKLCH and modern CSS colors to PDF-compatible formats
- **Professional Styling**: Optimized CSS for print output

### User Experience
- **Loading Indicator**: Shows progress during PDF generation
- **Toast Notifications**: Provides feedback on export success/failure
- **Error Handling**: Graceful error handling with user-friendly messages
- **Custom Filename**: Automatically generates filename based on the user's name

## Technical Implementation

### Libraries Used
- `html2canvas-pro`: Enhanced version of html2canvas with better OKLCH color support
- `jspdf`: PDF generation library
- Custom CSS optimizations for print output

### Key Files
- `lib/pdfExport.js`: Main export functionality
- `components/ExportButton.js`: Reusable export button component
- `components/Toast.js`: Toast notification system
- `styles/pdf-export.css`: PDF-specific styling optimizations

### Export Process
1. User clicks "Exportovat do PDF" button
2. System prepares the CV element with optimized styling
3. html2canvas-pro captures the CV as a high-resolution image
4. jsPDF converts the image to PDF format
5. File is automatically downloaded with a custom filename

## Usage

1. Fill out your CV information in the editor
2. Click the "Exportovat do PDF" button in the sidebar
3. Wait for the export process to complete
4. Your CV will be downloaded as a PDF file named `[Your_Name]_CV.pdf`

## Templates Supported

All CV templates are fully supported for PDF export:
- Moderní CV (Modern)
- Klasické CV (Classic)
- Kreativní CV (Creative)
- Profesionální CV (Professional)

## Troubleshooting

### Common Issues
- **Colors not appearing correctly**: The system automatically converts OKLCH and modern CSS colors to PDF-compatible formats
- **Layout issues**: The CSS is optimized for print output and handles responsive elements
- **Long content**: Automatically splits content across multiple pages when needed

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Works best in browsers with full ES6+ support

## Development Notes

### Future Enhancements
- Option to select different page sizes (Letter, Legal, etc.)
- Custom export settings (margins, quality, etc.)
- Batch export for multiple CVs
- Export preview before download

### Performance Considerations
- Uses high-quality rendering (scale: 2) for crisp output
- Optimized for modern browsers
- Lazy-loaded components to reduce initial bundle size

## Support

If you encounter any issues with the PDF export functionality:
1. Check that your browser supports HTML5 Canvas
2. Ensure JavaScript is enabled
3. Try refreshing the page and attempting export again
4. For persistent issues, check the browser console for error messages
