import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

// Export CV as PDF
export const exportToPDF = async (elementId, fileName = 'cv') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('CV element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      letterRendering: true,
      foreignObjectRendering: true,
      onclone: (clonedDoc) => {
        // Override any problematic CSS custom properties in the cloned document
        const style = clonedDoc.createElement('style');
        style.textContent = `
          * {
            background-color: inherit !important;
            color: inherit !important;
            border-color: inherit !important;
          }
          .bg-white { background-color: #ffffff !important; }
          .bg-gray-50 { background-color: #f9fafb !important; }
          .bg-gray-100 { background-color: #f3f4f6 !important; }
          .bg-gray-200 { background-color: #e5e7eb !important; }
          .bg-gray-700 { background-color: #374151 !important; }
          .bg-gray-800 { background-color: #1f2937 !important; }
          .text-gray-500 { color: #6b7280 !important; }
          .text-gray-600 { color: #4b5563 !important; }
          .text-gray-700 { color: #374151 !important; }
          .text-gray-800 { color: #1f2937 !important; }
          .text-blue-600 { color: #2563eb !important; }
          .text-purple-600 { color: #9333ea !important; }
          .text-purple-500 { color: #a855f7 !important; }
          .border-gray-200 { border-color: #e5e7eb !important; }
          .border-gray-300 { border-color: #d1d5db !important; }          .border-gray-600 { border-color: #4b5563 !important; }
          .bg-gradient-to-br { background: linear-gradient(to bottom right, #ede9fe, #dbeafe) !important; }
          .bg-gradient-to-r { background: linear-gradient(to right, #a855f7, #3b82f6) !important; }
          
          /* Fix transparent text issues during export */
          .text-transparent { color: #9333ea !important; -webkit-background-clip: unset !important; background-clip: unset !important; }
          .bg-clip-text { -webkit-background-clip: unset !important; background-clip: unset !important; }
          
          /* Specific fixes for creative template gradients */
          .bg-gradient-to-r.from-purple-600.to-blue-600 { background: #9333ea !important; }
          .text-transparent.bg-gradient-to-r { color: #9333ea !important; }
          
          /* Background colors for gradient containers */
          .from-purple-50 { background-color: #faf5ff !important; }
          .to-blue-50 { background-color: #eff6ff !important; }
          .bg-purple-100 { background-color: #e9d5ff !important; }          .from-purple-500 { background-color: #a855f7 !important; }
          .to-blue-500 { background-color: #3b82f6 !important; }
          
          /* Additional gradient overrides for better export */
          .from-blue-600 { background-color: #2563eb !important; }
          .to-purple-600 { background-color: #9333ea !important; }          .hover\\:from-blue-700 { background-color: #1d4ed8 !important; }
          .hover\\:to-purple-700 { background-color: #7c3aed !important; }
          
          /* Text wrapping and overflow fixes for export */
          .break-words { 
            word-wrap: break-word !important; 
            overflow-wrap: break-word !important; 
            word-break: break-word !important;
            hyphens: auto !important;
          }
          .flex-wrap { flex-wrap: wrap !important; }
          .whitespace-nowrap { white-space: nowrap !important; }
          
          /* Ensure proper text display in containers */
          div, span, p, h1, h2, h3, h4, h5, h6 {
            overflow: visible !important;
            text-overflow: unset !important;
            white-space: normal !important;
          }
          
          /* Specific fixes for company and school names */
          .text-purple-600.font-medium,
          .text-gray-600.font-medium,
          .text-gray-700.font-medium {
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            max-width: 100% !important;
            white-space: normal !important;
          }
        `;
        clonedDoc.head.appendChild(style);
      }
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${fileName}.pdf`);
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};

// Export CV as Image (PNG)
// Export CV as Image
export const exportToImage = async (elementId, fileName = 'cv') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('CV element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      letterRendering: true,
      foreignObjectRendering: true,
      onclone: (clonedDoc) => {
        // Override any problematic CSS custom properties in the cloned document
        const style = clonedDoc.createElement('style');
        style.textContent = `
          * {
            background-color: inherit !important;
            color: inherit !important;
            border-color: inherit !important;
          }
          .bg-white { background-color: #ffffff !important; }
          .bg-gray-50 { background-color: #f9fafb !important; }
          .bg-gray-100 { background-color: #f3f4f6 !important; }
          .bg-gray-200 { background-color: #e5e7eb !important; }
          .bg-gray-700 { background-color: #374151 !important; }
          .bg-gray-800 { background-color: #1f2937 !important; }
          .text-gray-500 { color: #6b7280 !important; }
          .text-gray-600 { color: #4b5563 !important; }
          .text-gray-700 { color: #374151 !important; }
          .text-gray-800 { color: #1f2937 !important; }
          .text-blue-600 { color: #2563eb !important; }
          .text-purple-600 { color: #9333ea !important; }
          .text-purple-500 { color: #a855f7 !important; }
          .border-gray-200 { border-color: #e5e7eb !important; }
          .border-gray-300 { border-color: #d1d5db !important; }          .border-gray-600 { border-color: #4b5563 !important; }
          .bg-gradient-to-br { background: linear-gradient(to bottom right, #ede9fe, #dbeafe) !important; }
          .bg-gradient-to-r { background: linear-gradient(to right, #a855f7, #3b82f6) !important; }
          
          /* Fix transparent text issues during export */
          .text-transparent { color: #9333ea !important; -webkit-background-clip: unset !important; background-clip: unset !important; }
          .bg-clip-text { -webkit-background-clip: unset !important; background-clip: unset !important; }
          
          /* Specific fixes for creative template gradients */
          .bg-gradient-to-r.from-purple-600.to-blue-600 { background: #9333ea !important; }
          .text-transparent.bg-gradient-to-r { color: #9333ea !important; }
          
          /* Background colors for gradient containers */
          .from-purple-50 { background-color: #faf5ff !important; }
          .to-blue-50 { background-color: #eff6ff !important; }
          .bg-purple-100 { background-color: #e9d5ff !important; }          .from-purple-500 { background-color: #a855f7 !important; }
          .to-blue-500 { background-color: #3b82f6 !important; }
          
          /* Additional gradient overrides for better export */
          .from-blue-600 { background-color: #2563eb !important; }
          .to-purple-600 { background-color: #9333ea !important; }          .hover\\:from-blue-700 { background-color: #1d4ed8 !important; }
          .hover\\:to-purple-700 { background-color: #7c3aed !important; }
          
          /* Text wrapping and overflow fixes for export */
          .break-words { 
            word-wrap: break-word !important; 
            overflow-wrap: break-word !important; 
            word-break: break-word !important;
            hyphens: auto !important;
          }
          .flex-wrap { flex-wrap: wrap !important; }
          .whitespace-nowrap { white-space: nowrap !important; }
          
          /* Ensure proper text display in containers */
          div, span, p, h1, h2, h3, h4, h5, h6 {
            overflow: visible !important;
            text-overflow: unset !important;
            white-space: normal !important;
          }
          
          /* Specific fixes for company and school names */
          .text-purple-600.font-medium,
          .text-gray-600.font-medium,
          .text-gray-700.font-medium {
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            max-width: 100% !important;
            white-space: normal !important;
          }
        `;
        clonedDoc.head.appendChild(style);
      }
    });

    canvas.toBlob((blob) => {
      saveAs(blob, `${fileName}.png`);
    });

    return true;
  } catch (error) {
    console.error('Error exporting to image:', error);
    throw error;
  }
};

// Export CV as Word document
export const exportToWord = async (cvData, fileName = 'cv') => {
  try {
    const doc = new Document({
      sections: [{
        children: [
          // Header with name and title
          new Paragraph({
            children: [
              new TextRun({
                text: cvData.personal.name,
                bold: true,
                size: 32,
                color: "2563eb"
              })
            ],
            heading: HeadingLevel.TITLE
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: cvData.personal.title,
                size: 24,
                color: "6b7280"
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `📧 ${cvData.personal.email} | 📞 ${cvData.personal.phone} | 📍 ${cvData.personal.address}`,
                size: 20
              })
            ]
          }),
          
          // About section
          new Paragraph({
            children: [
              new TextRun({
                text: "O mně",
                bold: true,
                size: 24
              })
            ],
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: cvData.personal.about,
                size: 20
              })
            ]
          }),

          // Work Experience
          new Paragraph({
            children: [
              new TextRun({
                text: "Pracovní zkušenosti",
                bold: true,
                size: 24
              })
            ],
            heading: HeadingLevel.HEADING_1
          }),
          ...cvData.experience.map(exp => [
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.title,
                  bold: true,
                  size: 22
                }),
                new TextRun({
                  text: ` | ${exp.startDate} - ${exp.endDate}`,
                  size: 18,
                  color: "6b7280"
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.company,
                  size: 20,
                  italics: true
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.description,
                  size: 20
                })
              ]
            })
          ]).flat(),

          // Education
          new Paragraph({
            children: [
              new TextRun({
                text: "Vzdělání",
                bold: true,
                size: 24
              })
            ],
            heading: HeadingLevel.HEADING_1
          }),
          ...cvData.education.map(edu => [
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.degree,
                  bold: true,
                  size: 22
                }),
                new TextRun({
                  text: ` | ${edu.startDate} - ${edu.endDate}`,
                  size: 18,
                  color: "6b7280"
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.school,
                  size: 20,
                  italics: true
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.description,
                  size: 20
                })
              ]
            })
          ]).flat(),

          // Skills
          new Paragraph({
            children: [
              new TextRun({
                text: "Dovednosti",
                bold: true,
                size: 24
              })
            ],
            heading: HeadingLevel.HEADING_1
          }),
          ...cvData.skills.map(skill => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `${skill.name} (${skill.level}%)`,
                  size: 20
                })
              ]
            })
          ),

          // Languages
          new Paragraph({
            children: [
              new TextRun({
                text: "Jazyky",
                bold: true,
                size: 24
              })
            ],
            heading: HeadingLevel.HEADING_1
          }),
          ...cvData.languages.map(lang => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `${lang.name}: ${lang.level}`,
                  size: 20
                })
              ]
            })
          )
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName}.docx`);
    return true;
  } catch (error) {
    console.error('Error exporting to Word:', error);
    throw error;
  }
};
