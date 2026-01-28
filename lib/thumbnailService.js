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
      return null;
    }

    // Capture the element to canvas
    const canvas = await html2canvas(element, {
      scale: 0.5, // Good balance of quality and file size
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      // Use onclone to fix positioning in the cloned document
      onclone: (_clonedDoc, clonedElement) => {
        // Reset any transforms or positioning that might affect capture
        clonedElement.style.transform = 'none';
        clonedElement.style.position = 'relative';
        clonedElement.style.left = '0';
        clonedElement.style.top = '0';
        clonedElement.style.margin = '0';
      },
    });

    // Convert canvas to WEBP Base64 with high quality
    return canvas.toDataURL('image/webp', 0.9);
  } catch (error) {
    return null;
  }
};


