// Thumbnail generation service (Base64 stored in Firestore)
import html2canvas from 'html2canvas-pro';

/**
 * Generate a thumbnail from a DOM element as Base64 string
 * @param {HTMLElement} element - The DOM element to capture (e.g., #cv-preview)
 * @returns {Promise<string|null>} - The Base64 data URL or null on error
 */
export const generateThumbnail = async (element) => {
  try {
    if (!element) {
      console.error('No element provided for thumbnail generation');
      return null;
    }

    // Get the actual content dimensions
    const width = element.scrollWidth || element.offsetWidth;
    const height = element.scrollHeight || element.offsetHeight;

    // Capture the element to canvas
    const canvas = await html2canvas(element, {
      scale: 0.5, // Good balance of quality and file size
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      // Use onclone to fix positioning in the cloned document
      onclone: (clonedDoc, clonedElement) => {
        // Reset any transforms or positioning that might affect capture
        clonedElement.style.transform = 'none';
        clonedElement.style.position = 'relative';
        clonedElement.style.left = '0';
        clonedElement.style.top = '0';
        clonedElement.style.margin = '0';
      },
    });

    // Convert canvas to WEBP Base64 with high quality
    const base64 = canvas.toDataURL('image/webp', 0.9);
    
    // Log size for debugging
    const sizeInBytes = Math.round((base64.length * 3) / 4);
    const sizeInKB = (sizeInBytes / 1024).toFixed(1);
    console.log(`Thumbnail generated: ${sizeInKB} KB, dimensions: ${canvas.width}x${canvas.height}`);

    return base64;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
};


