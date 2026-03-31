// Thumbnail generation service (Base64 stored in Firestore)
import html2canvas from 'html2canvas-pro';

/**
 * Generate a thumbnail from a DOM element as Base64 string.
 * @param {HTMLElement} element
 * @returns {Promise<string|null>}
 */
export const generateThumbnail = async (element) => {
  try {
    if (!element) return null;

    const canvas = await html2canvas(element, {
      scale: 0.5,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (_clonedDoc, clonedElement) => {
        clonedElement.style.transform = 'none';
        clonedElement.style.position = 'relative';
        clonedElement.style.left = '0';
        clonedElement.style.top = '0';
        clonedElement.style.margin = '0';
      },
    });

    return canvas.toDataURL('image/webp', 0.9);
  } catch {
    return null;
  }
};

/**
 * Generate a thumbnail by element ID.
 * If the element is hidden (e.g. mobile edit/preview toggle), it is cloned into a
 * temporary off-screen container so html2canvas can render it, then cleaned up.
 * @param {string} elementId - The DOM element ID to capture (e.g. 'cv-page')
 * @returns {Promise<string|null>}
 */
export const generateThumbnailFromId = async (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) return null;

  const isHidden =
    element.offsetParent === null ||
    getComputedStyle(element.parentElement).display === 'none';

  if (!isHidden) {
    return generateThumbnail(element);
  }

  // Element is not painted — clone it off-screen so html2canvas can render it
  const tempContainer = document.createElement('div');
  tempContainer.style.cssText =
    'position:fixed;top:-9999px;left:-9999px;width:794px;height:1123px;' +
    'overflow:hidden;pointer-events:none;z-index:-1;';

  const clone = element.cloneNode(true);
  clone.style.transform = 'none';
  clone.style.position = 'relative';
  clone.style.top = '0';
  clone.style.left = '0';
  clone.style.width = '794px';
  clone.style.minHeight = '1123px';

  tempContainer.appendChild(clone);
  document.body.appendChild(tempContainer);

  // Small delay to let the browser paint the cloned element
  await new Promise((resolve) => setTimeout(resolve, 100));

  const result = await generateThumbnail(clone);

  document.body.removeChild(tempContainer);

  return result;
};